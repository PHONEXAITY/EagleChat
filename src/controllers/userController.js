import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { sendSuccess,
    sendBadrequest,
    sendCreated,
    sendForbidden,
    sendNocontent,
    sendNotFound,
    sendServerErr,
    sendUnauthorized
 } from '../service/responseHandle.js';
 import { ErrorMessage, successMessage } from '../service/message.js';
 import { validateEmail } from '../service/validate.js';
 import jwt from 'jsonwebtoken';

 export const register = async (req,res) => {
        try {
            const {username, email, phoneNumber, password, confirmPassword} = req.body;
            
            if (!validateEmail(email)) {
                return sendBadrequest(res,'Invalid email format');
              }
            if(password !== confirmPassword){
               return sendBadrequest(res,ErrorMessage.notMatchPassword)
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({
                username,
                email,
                phoneNumber,
                password: hashedPassword
            });

            const newUser = await user.save();
            const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "2h" });
            res.cookie('token', token, { httpOnly: true});
            return sendCreated(res,successMessage.register,{newUser,token});

        } catch (error) {
            console.error(error.message);
            return sendServerErr(res,ErrorMessage.serverError);
        }
    }

    export const login = async (req,res) => {
        const {email, password} = req.body;
        if (!email || !password) {
            return sendBadrequest(res,ErrorMessage.pleaseInput);
        }
        try {
            const user = await User.findOne({ email });
        
             if (!user) {
                return sendNotFound(res,"Email Not found !");
             }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return sendBadrequest(res,ErrorMessage.notMatchPassword);
            }
            const token = jwt.sign({ _id:user._id }, process.env.SECRET_KEY, { expiresIn: "2h" });
            res.cookie('token', token, { httpOnly: true});
                return sendSuccess(res,successMessage.login,token);
          
          } catch (error) {
            console.error("error:", error.message)
             return sendServerErr(res, ErrorMessage.serverError);
          }
        };

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
