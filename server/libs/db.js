import mongoose from "mongoose"

const connectDb = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI ||"mongodb://localhost:27017/");
        console.log('Db Connected');
    }catch(error){
        console.log('Error connecting Db',error);
        process.exit(1);
    }
}

export default connectDb;