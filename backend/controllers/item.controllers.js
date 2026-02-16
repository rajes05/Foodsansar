import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Fuse from "fuse.js";

export const addItem = async (req, res) => {
  try {
    // for getting data from request body
    const { name, category, price, foodType, description } = req.body;

    // req.file is the file uploaded by the user in the request body by multer middleware

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // find the shop owned by the currently authenticated user
    const shop = await Shop.findOne({ owner: req.userId }).populate("items");

    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    // creating item
    const item = await Item.create({
      // shop._id is the unique ID of the shop that was found for the current user.
      name,
      image,
      shop: shop._id,
      category,
      price,
      foodType,
      description,
    });
    shop.items.push(item._id);
    await shop.save();
    await shop.populate("owner");
    await shop.populate({
      // to sort items : latest at top
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    // it links the new item to that shop in the database.

    return res.status(201).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Add item error: ${error.message}` });
  }
};

export const editItem = async (req, res) => {
  try {
    // The 'itemId' is retrieved from the route parameter defined in your route e.g. "/items/:itemId".

    const itemId = req.params.itemId;
    const { name, category, foodType, price, description } = req.body;

    let image;
    // req.file is the file uploaded by user in request body by multer middleware
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    // find item by id and Update
    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        description,
        image, // old image will be undefined so use ...(image && {image}) to update only if image is provided else keep old image
      },
      { new: true }
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate({
      // to sort items : latest at top
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Edit item error: ${error.message}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `get item error ${error}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i !== item._id);
    await shop.save();
    await shop.populate({
      // to sort : latest at top
      path: "items",
      options: { sort: { updatedAt: -1 } },
    });

    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `delete item error ${error}` });
  }
};

export const getItemByCity = async (req, res) => {
  try {
    // extract value from request url parameter and store it in city variable
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }

    const shops = await Shop.find({
      // regex ignores uppercase and lowercase differences
      city: { $regex: new RegExp(`^${city}$`, "i") },
    }).populate("items");

    if (!shops) {
      return res.status(400).json({ message: "shops not found" });
    }

    // store shops id
    const shopIds = shops.map((shop) => shop._id);

    const items = await Item.find({ shop: { $in: shopIds } })
    .populate("shop", "name")

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `get item by city error ${error}` });
  }
};

export const getItemByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shop = await Shop.findById(shopId).populate({
      path:"items",
      populate:{
        path:"shop",
        select:"name"
      }
    });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    return res.status(200).json({
      shop,
      items: shop.items,
    });
  } catch (error) {
    return res.status(500).json({ message: `get item by shop error ${error}` });
  }
};

export const searchItems = async (req, res) => {
  try {
    const { query, city } = req.query;
    if (!query || !city) {
      return null;
    }

    // 1. Find all shops in the requested city
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    if (!shops || shops.length === 0) {
      return res.status(404).json({ message: "No shops found in this city" });
    }

    const shopIds = shops.map((s) => s._id);

    // 2. Fetch ALL items from these shops to perform Fuzzy Search in memory
    const allCityItems = await Item.find({
      shop: { $in: shopIds },
    }).populate("shop", "name image");

    if (!allCityItems || allCityItems.length === 0) {
      return res.status(200).json([]);
    }

    // 3. Configure Fuse.js options
    const options = {
      includeScore: true,
      keys: ["name", "category", "foodType"], // Fields to search in
      threshold: 0.4, // 0.0 = exact match, 1.0 = match anything. 0.3-0.4 is good for "fuzzy"
    };

    const fuse = new Fuse(allCityItems, options);

    // 4. Perform Search
    const result = fuse.search(query);

    // 5. Extract items from Fuse result structure ({ item, score, refIndex })
    const fuzzyItems = result.map((r) => r.item);

    return res.status(200).json(fuzzyItems);

  } catch (error) {
    return res.status(500).json({ message: `search items error ${error}` });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body
    if (!itemId || !rating) {
      return res.status(400).json({ message: "itemId and rating is required" })
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be 1 to 5" })
    }
    const item = await Item.findById(itemId)
    if (!item) {
      return res.status(400).json({ message: "item not found" })
    }

    const newCount = item.rating.count + 1
    const newAverage = (item.rating.average * item.rating.count + rating) / newCount
    item.rating.count = newCount
    item.rating.average = newAverage
    await item.save()

    return res.status(200).json({ rating: item.rating })
  } catch (error) {
    return res.status(500).json({ message: `rating error ${error}` })
  }
}
