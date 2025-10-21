
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();


export const upload = multer({
    storage ,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },

    fileFilter:(req,file,cb)=>{

        if(file.mimetype.startsWith("image/")){
            cb(null,true);
        }else{
            cb(new Error('Only image files are allowed!'),false);
        }
    }
});



export const uploadImage = async(req,res)=>{

    try{


        if(!req.file){
            return res.status(400).json({error:"No file uploaded"});
        }


        const b64 = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${b64}`;


        const result = await cloudinary.uploader.upload(dataURI,{
            folder:"blog_images",
            resource_type:"image",
            transformation:[
                {width:1200, height:800, crop:"limit"},
                {quality:'auto'},
                {format:'auto'}
            ]
        });


        res.json({
            success:true,
            data:{
                uri:result.secure_url,
                public_id:result.public_id,
                width:result.width,
                height:result.height
            }
        })
    }catch(err){
        console.error("Error uploading image:",err);
        res.status(500).json({error:"Failed to upload image"});
    }
}
