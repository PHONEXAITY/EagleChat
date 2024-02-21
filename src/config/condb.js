import mongoose  from "mongoose";

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGODB);
        console.log('Connect to MongoDB');
    }catch (error){
        console.error('MongoDB connect error:', error.message);
        process.exit(1);
    }
};

export default connectDB ;