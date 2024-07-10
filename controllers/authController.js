import User from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwttoken from "jsonwebtoken"

const auth = async (req, res) => {
    try {
        const { username, name, password, email, avatar } = req.body;

        if (!name || !password || !email || !username) {
            return res.status(400).json({ "message": "All parameters are required" });
        }

        const existedUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existedUser) {
            return res.status(409).json({ "message": "Email/Username already exists." });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = await User.create({
            username,
            name,
            password: hashedPassword,
            email,
            avatar
        });
        const {password: pass, ...rest} = newUser._doc;
        const token = jwttoken.sign({id: newUser._id},process.env.SECRET_KEY)

        const options= {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie('access_token_auth', token, options).json(rest);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal server error" });
    }
};


const signIn = async (req,res,next) =>{
    try {
        const {username,email,password} = req.body;

        if(!(username || email) || !password){
            return res.status(400).json({"message":"Please enter all details"})
        }

        const existsUser = await User.findOne({
            $or: [{ email }, { username }]
        })

        if (!existsUser) {
            return res.status(409).json({ "message": "User not found" });
        }

        const verified = bcrypt.compareSync(password, existsUser.password);

        if(!verified){
            return res.status(404).json({"message" : "Wrong credentials"})
        }

        const token = jwttoken.sign({
            id: existsUser._id
        }, process.env.SECRET_KEY)
        
        // console.log("Allright");
        // console.log(token);
        
        const options = {
            httpOnly: true,
            secure: true
        }

        const {password: pass, ...loggedIn} = existsUser._doc
        // const loggedIn = await User.findById(existsUser._id).select("-password");

        return res.status(200).cookie("access_token", token, options).json(loggedIn)
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal server error!" });
    }
};

const googleAuth = async (req, res) => {
    try {
        // const {email} = req.body.email;

        const user = await User.findOne({email:req.body.email});
        console.log(user);
        if(!user){
            const password = Math.random().toString(10);
            const hashedPassword = bcrypt.hashSync(password,10);
            const newUser = await User.create({
                name: req.body.name,
                username: req.body.email,
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.avatar
            })

            const {password: pass, ...rest} = newUser._doc;
            const token = jwttoken.sign({id: newUser._id},process.env.SECRET_KEY)

            const options= {
                httpOnly: true,
                secure: true
            }

            return res.status(200).cookie('access_token_google', token, options).json(rest);
        }
        
        const token = jwttoken.sign({
            id: user._id
        }, process.env.SECRET_KEY)

        const {password: pass, ...rest} = user._doc;

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.cookie("access_token", token, options).status(200).json(rest);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ "message": "Internal server error!" });
    }
}

const signOut = async (req,res) => {
    try {
        return res.status(200).clearCookie("access_token").json({"message": "SignOut successfully"});
    } catch (error) {
        return res.status(501).json({"message" : "Internal server error"})
    }
}

export {auth, signIn, googleAuth, signOut};
