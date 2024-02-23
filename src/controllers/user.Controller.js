import User from "../models/User.js";
import { successMessage } from "../service/message.js";
import { sendNotFound, sendServerErr, sendSuccess } from "../service/responseHandle.js";

export const getProfile = async (req, res) => {
    try {
      const userId = req.decoded._id;
      const user = await User.findById(userId);
      
      if (!user) {
        return sendNotFound(res, ErrorMessage.notFound);
      }else{

       return sendSuccess(res, successMessage.getOne,user.profilePicture);
      }
  
    } catch (err) {
      return sendServerErr(res,err.message);
    }
  };
  
  export const postProfile = async (req, res) => {
    try {
        const userId = req.decoded; 
        const { profilePicture } = req.body;
    
        if (!profilePicture) {
          return sendBadrequest(res, 'Profile data is required');
        }
    
        const user = await User.findOne({_id:userId});
    
        if (!user) {
          console.log('User not found in the database');
          return sendNotFound(res, ErrorMessage.notFound);
        }
    
        user.profilePicture  = profilePicture;
        await user.save();
        console.log('Profile image uploaded successfully');
    
        return sendCreated(res, 'Profile image uploaded successfully');
      } catch (error) {
        console.error('Error uploading profile:', error);
        return sendServerErr(res, ErrorMessage.serverError);
      }
  };
  
export const changeProfile = async (req, res) => {
    try {
      const userId = req.decoded; 
        const { profilePicture } = req.body;

        const user = await User.findOneAndUpdate(
            { _id: userId }, 
            { profilePicture }, 
            { new: true }
        );

        if (!user) {
            return sendNotFound(res, 'User not found');
        }

        return sendSuccess(res, 'Profile updated successfully',user.profile);
    } catch (error) {
        console.error(error);
        return sendServerErr(res, error.message);
    }
};
export const getUsersForSidebar = async (req,res) => {
    try {
        const loggedInUserId = req.decoded._id;
        const filteredUsers = await User.find({_id: { $ne: loggedInUserId }}).select('-password');

        return sendSuccess(res,successMessage.getAll,filteredUsers);
    } catch (error) {
        console.error(error);
        return sendServerErr(res, error.message);
    }
};