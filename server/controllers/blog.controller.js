import { Blog } from "../models/blog.model.js"
import { generateSlug } from "../utils/slug.js";
import { validateBlog } from "../utils/validation.js"


export const createblog = async(req,res)=>{

    const dataCheck = validateBlog(req.body);
    if(!dataCheck.success) return res.status(400).json({error:"Invalid data", details:dataCheck.error.errors});

    try{
        const newSlug = generateSlug(req.body.title);


        const existingBlog = await Blog.findOne({slug:newSlug});
        if(existingBlog){
            return res.status(400).json({error:"Blog with similar title exists, try different title"});
        }

        const newBlog = new Blog({
            title:req.body.title,
            content:req.body.content,
            slug:newSlug,
            imageUrl:req.body.imageUrl
        });


        await newBlog.save();

        return  res.status(201).json({message:"Blog created successfully", data:newBlog});

    }catch(err){

        console.error("Error creating blog:",err);
        return res.status(500).json({error:"Internal server error"});
    }

}


export const getAllBlogs = async(req,res)=>{


    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;


    try{
        const blogs = await Blog.find().sort({createdAt:-1}).limit(limit).skip(offset);
        return res.status(200).json({data:blogs});
    }
    catch(err){
        console.error("Error fetching blogs:",err);
        return res.status(500).json({error:"Internal server error"});
    }
}



export const getBlogBySlug = async(req,res)=>{

    console.log("Fetching blog with slug:", req.params.slug);
    const {slug} = req.params;
    try{
        const blog = await Blog.findOne({slug});
        if(!blog) return res.status(404).json({error:"Blog not found"});
        return res.status(200).json({data:blog});
    }
    catch(err){
        console.error("Error fetching blog:",err);
        return res.status(500).json({error:"Internal server error"});
    }
}


export const deleteBlogBySlug = async(req,res)=>{

    const {slug} = req.params;
    try{
        const blog = await Blog.findOneAndDelete({slug});
        if(!blog) return res.status(404).json({error:"Blog not found"});
        return res.status(200).json({message:"Blog deleted successfully"});

    }catch(err){
        console.error("Error deletign blog: ",err);
        return res.status(500).json({error:"Internal server error"});
    }
}

export const updateBlogBySlug = async(req,res)=>{

    const {slug}= req.params;
    const dataCheck = validateBlog(req.body);
    if(!dataCheck.success) return res.status(400).json({error:"Invalid data", details:dataCheck.error.errors});


    try{
        const updatedBlog = await Blog.findOneAndUpdate({slug},{
            title:req.body.title,
            content:req.body.content,
            imageUrl:req.body.imageUrl
        },{new:true});


        if(!updatedBlog) return res.status(404).json({error:"Blog not found"});
        return res.status(200).json({message:"Blog updated successfully", data:updatedBlog});


    }catch(err){
        console.error("Error updating blog:",err);
        return res.status(500).json({error:"Internal server error"});
    }
}



export const searchBlogs = async(req,res)=>{

    try{

        const {q} = req.query;

        if(!q || q.trim() ===""){
            return res.status(400).json({error:"Query parameter 'q' is required"});
        }

        const blogs = await Blog.find({

            $or:[
                {title:{$regex:q,$options:"i"}},
                {content:{$regex:q,$options:"i"}}
            ]
        }).sort({createdAt:-1});

        res.json({data:blogs});
    }catch(err){
        console.error("Error searching blogs:",err);
        res.status(500).json({error:"Internal server error"});
    }
}
