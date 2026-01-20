import multer from "multer";

// this middleware is used to upload files to the server

const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,"./public");
    },
    filename:(req, file, cb)=>{
        cb(null,file.originalname);
    }
});

export const upload = multer({ storage });