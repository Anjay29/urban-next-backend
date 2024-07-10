import jwttoken from "jsonwebtoken";

const verifyJWT = (req,res, next) => {
  const token = req.cookies.access_token;

  if(!token){
    return res.status(404).json({"message" : "Unauthorized"});
  }

  jwttoken.verify(token,process.env.SECRET_KEY, (error, user) => {
    if(error){
      return res.status(403).json({"message" : "Forbidden"})
    }

    req.user = user
    // console.log(user);
    next();
  })

}

export default verifyJWT