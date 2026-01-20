import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createEditShop = async (req, res) => { 
    try {
        const {name, city, province, address} = req.body;

        // for getting image from request
        let image;

        // req.file is the file uploaded by the user in the request body by multer middleware

        if(req.file){
            // console.log(req.file)
            image = await uploadOnCloudinary(req.file.path);
        }

        // let to assign value to it later in Shop.create()
        let shop = await Shop.findOne({owner:req.userId});

        // create shop if not exists else update
        if(!shop){
            if(!image){
                return res.status(400).json({message:"Shop image is required"});
            }
            shop = await Shop.create({  
                name,
                city,
                province,
                address,
                image,
                owner:req.userId,
            });
        }else{
            const updatePayload = {
                name,
                city,
                province,
                address,
                owner:req.userId,
            };

            if(image){
                updatePayload.image = image;
            }

            shop = await Shop.findByIdAndUpdate(
                shop._id,
                updatePayload,
                {new:true}
            );
        }

       // populate means to get the owner details from the user model
       // populate both owner and items
        await shop.populate("owner items");

        return res.status(201).json(shop); // send back the created shop as response

    } catch (error) {
        return res.status(500).json(`Create shop error: ${error}`);
    }
};

export const getMyShop = async (req, res) => {
    try {
        // userId is available from the isAuth middleware
        // populate means to get the owner details from the user model

        const shop = await Shop.findOne({owner:req.userId}).populate("owner").populate({
             // to sort items : latest at top
            path:"items",
            options:{sort:{updatedAt:-1}}
        });
        if(!shop){
            return res.status(200).json(null);
        }
        return res.status(200).json(shop);
    } catch (error) {
        return res.status(500).json(`Get my shop error: ${error}`);
    }

};

export const getShopByCity = async(req, res)=>{
    try {
        // extracts the city value form request url parameters and store it in city variable
        const {city} = req.params;
        
        const shops = await Shop.find({
            // regex ignore uppercase and lowercase differences
            city:{$regex:new RegExp(`^${city}$`,"i")}
        }).populate("items");

        if(!shops){
            return res.status(400).json({message:"Shops not found"});
        }
        return res.status(200).json(shops);
    } catch (error) {
        return res.status(500).json({message:`Get Shops by city error ${error}`});
    }
};

