import User from "../Models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//Signup Controller
export const signup = async (req, res) => {
  try {
    const userData = new User(req.body);
    const { email } = userData;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User Already exists" });
    }
    const savedUser = await userData.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// login controller
export const login = async(req, res) =>{
  try {
      const {email, password} = req.body;
      const userExist = await User.findOne({email});
      if(!userExist){
          return res.status(400).json({message: "User not exist"});
      }

      // compare password with database password
      const isValidPassword = await bcrypt.compare(password, userExist.password);
      if(!isValidPassword){
          return res.status(401).json({message: "email or password invalid"});
      }

      // checking login status by token
      const tokenExist = req.cookies.token;
      if(tokenExist){
          return res.status(400).json({message: "Already login"});
      }

      // generate token with user data and store in the cookie
      const token = jwt.sign({userId: userExist._id}, process.env.SECRET_KEY, {expiresIn: '1h'});
      res.cookie("token",token, {httpOnly: true, maxAge: 3600000})
      res.status(200).json({message: "Login successfully"});
  

  } catch (error) {
      res.status(500).json({error: error})
  } 
}


// Log out Controller
export const logout = async (req, res) => {
  try {
    const tokenExist = req.cookies.token;
    if (!tokenExist) {
      return res.status(400).json({ message: "Login Required" });
    }
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out sucessfully" });
  } catch (error) {
    res.status(500).json({error: error})
  }
};


//update User Controller
export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({_id: id});

    if (!userExist){
      return res.status(400).json({message: "No user found"});
    }

    //password hashing
    if(req.body.password){
      const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;
    }

    //update user Data

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {new: true})
    res.status(200).json({message: "User updated Successfully",  updatedUser})
    console.log("Update User Id: ", req.userIdentity);
  } catch (error) {
    
  }
};


//get All Users Controller
export const getAllUsers = async (req, res) => {
try {
  const users = await User.find();

  if(!users){
    return res.status(404).json({message: "No Users found"})
  }

  res.status(200).json(users);
} catch (error) {
  return res.status(500).json({error: error})
}
}