import mongoose from "mongoose";




const blogSchema = new mongoose.Schema(

    {
        title:{
            type:String,
            required:true
        },
        

        content:{
            type:String,
            required:true
        },

        slug:{
            type:String,
            required:true,
            unique:true
        },

        imageUrl:[
            {
                type:String,

            }
        ]
    },{timestamps:true}
)






export const Blog = mongoose.model("Blog",blogSchema);