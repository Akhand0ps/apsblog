import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    image:{
      type:String,
    },
    
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["customer", "collector", "admin"],
    },

    address: {
      type: String,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
 

export default User;