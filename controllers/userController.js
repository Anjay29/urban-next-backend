import bcrypt from "bcrypt";
import User from "../models/usermodel.js";
import Listing from "../models/listingmodel.js";

const updateUser = async (req, res) => {
    if(req.user.id !== req.params.id){
      return res.status(404).json({"message" : "You are only able to make change in your account"})
    }

    try {
      if(req.body.password){
        req.body.password = bcrypt.hashSync(req.body.password,10);
      }

      const updateuser = await User.findByIdAndUpdate(req.params.id, {
        $set:{
          email: req.body.email,
          password: req.body.password,
          username: req.body.username,
          name: req.body.name,
          avatar: req.body.avatar
        }
      },{new: true})


      const {password, ...rest} = updateuser._doc;

      return res.status(200).json(rest)
    } catch (error) {
      console.log(error);
      return res.status(400).json({"message" : error.message})
    }
};

const deleteUser = async (req,res) => {
  if(req.user.id !== req.params.id){
    return res.status(404).json({"message" : "You are not authroized to delete this account."})
  }

  await User.findByIdAndDelete(req.params.id);
  return res.status(200).clearCookie('access_token').json({"message": "Account deleted"});
}
  
const getListings = async (req,res) => {
  try {
    if(req.params.id === req.user.id){
      const listings = await Listing.find({useRef : req.params.id});
      return res.status(200).json(listings);
    }
    else{
      return res.status(404).json({"message":"you are not authorised user"});
    }
  } catch (error) {
    return res.status(500).json({"message" : "Something went wrong geting Listings"})
  }
}

const getListing = async (req,res) => {
  try {
    const  listing = await Listing.findById(req.params.id);
    if(!listing){
      return res.status(404).json({"message" : "Problem in getting list"})
    }

    return res.status(200).json(listing);
  } catch (error) {
    return res.status(500).json({"message" : "Something went wrong"})
  }
}

const getUser = async (req,res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user){
      return res.status(404).json({"message":"User node found"})
    }

    const {password : pass, ...rest} = user._doc
    return res.status(200).json(rest);
  } catch (error) {
    return res.status(500).json({"message" : "Something went wrong during fetching the user"});
  }
}

export {updateUser, deleteUser, getListings, getListing, getUser};
  