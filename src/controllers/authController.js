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
            const token = jwt.sign({ _id: newUser._id }, process.env.SECRET_KEY, { expiresIn: "3h" });

            console.log("Generated token:", token);
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

        export const logout = async (req, res) => {
          try {
            res.clearCookie('token');
            sendSuccess(res,'Logged out successfully',{});
          } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
          }
        };

       
