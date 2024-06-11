import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  fullname: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50
    },
    username: {
      type: String,
      required: true,
      unique: true,
      match: /^\S+@\S+\.\S+$/,
      maxlength: 255
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 15
    },
    password: {
      type: String,
      required: true
    },
    gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
    profilePicture: {
      type: String,
      default: '/public/default.webp' 
    },
    status: {
      type: String,
      enum: ['Online', 'Offline'],
      default: 'Offline'
    }
  },
  {timestamps: true}
  );
  
  const User = mongoose.model('User', userSchema);
  
  export default User;