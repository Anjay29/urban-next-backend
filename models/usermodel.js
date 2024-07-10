import mongoose from "mongoose"

const userSchema = new mongoose.Schema({ 
	username: {
		type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
	},
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
	email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true,`Password is required`]
    },

    avatar:{
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyHZ4yjBXpnnG01YecWfbRFKuukNxlmYE4wRGg5I0jaj6StK0BLJ2SaQ-jcUXT_dAlmo&usqp=CAU"
    }
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema)
export default User