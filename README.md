# 🍔 FoodSansar  
## 🚀 Full-Stack MERN Food Ordering Platform

![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens)

> **FoodSansar** is a full-stack food ordering web application built using the MERN stack.  
> It allows users to browse restaurants by city, explore food menus, add items to cart, and place secure orders online.

🌐 **Live Demo:** (https://foodsansar.vercel.app/)  
📂 **GitHub Repository:** (https://github.com/rajes05/Foodsansar.git)

---

# ✨ Features

## 👤 User Features
- 🔐 Secure Authentication (JWT + bcrypt)
- 🏪 Browse shops by city
- 🍽️ View food items with images
- 🔍 Search functionality
- 🛒 Add to cart & manage cart
- 📦 Place orders
- 📱 Fully responsive UI

## 🛠️ Admin Features
- ➕ Add / Edit Shops
- ➕ Add / Edit Items
- ☁️ Image upload using Multer
- 🌩️ Cloudinary image storage
- 🔒 Protected routes with middleware

---

# 🏗️ Architecture Overview

Frontend (React + Tailwind)  
⬇ Axios API Calls  
Backend (Node.js + Express)  
⬇ Mongoose ODM  
MongoDB Database  
⬇  
Cloudinary (Image Hosting)

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- Context API

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Multer
- Cloudinary

## Deployment (Optional)
- Frontend → Vercel / Netlify
- Backend → Render / Railway
- Database → MongoDB Atlas

---

# 🔐 Authentication Flow

1. User registers  
2. Password hashed using bcrypt  
3. JWT token generated on login  
4. Token stored on client side  
5. Protected routes verified using middleware  

---

# 📁 Project Structure

```
foodsansar/
├── backend/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── App.jsx
│   └── index.html
│
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or yarn

---

## Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/foodsansar.git
cd foodsansar
```

### 2️⃣ Install Backend Dependencies
```bash
cd backend
npm install
```

### 3️⃣ Install Frontend Dependencies
```bash
cd frontend
npm install
```

### 4️⃣ Setup Environment Variables

Create a `.env` file in backend folder:

```
PORT=your_dynamic_port
WHITE_LISTED_ORIGINS=your_frontend_your
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5️⃣ Run Backend
```bash
npm run dev
```

### 6️⃣ Run Frontend
```bash
npm run dev
```

Frontend → http://localhost:5173  
Backend → http://localhost:5000  

---

# 📸 Screenshots

```
![Home Page](./screenshots/home.png)
![Shop Page](./screenshots/shop.png)
![Cart Page](./screenshots/cart.png)
```
---

# 🤝 Contributing

1. Fork the repository  
2. Create branch (`git checkout -b feature/your-feature`)  
3. Commit changes (`git commit -m "Add feature"`)  
4. Push branch (`git push origin feature/your-feature`)  
5. Open Pull Request  

---

# 📝 License

This project is licensed under the MIT License.

---

<div align="center">

## 👨‍💻 Developed by Rajesh Rana  
⭐ Star this repository if you found it helpful!

</div>
