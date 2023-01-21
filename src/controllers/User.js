
const User = require("../models/user.model");

const Publications = require("../models/Publications.model");

var nodemailer = require("nodemailer")


exports.getEq = async(req, res) => {
    const user = await User.find({ email: req.params.email }).populate("publication");
    try {

        if (user) {

            var UserJson = [];
            // mapping all Users to retrieve only specific data 
            user.map((c) => {
                UserJson.push({
                    publication: c.publication

                })
            });
            res.status(200).json(UserJson);
        }
    } catch (e) {


        res.status(400).json({ error: "Server error !" });
    }

}


exports.getOneuser= (req, res, next) => {

    User.findOne({ email: req.param('email') }, (error, user) => {
        if (error) {
            console.log(error)
            res.status(401).send(error)
        }
        else {
            res.status(200).json({ user: user });
        } 
    })
}





exports.postSocialLogin = async (req, res) => {
    console.log("test 22")
    User.findOne({email:req.body.email},(err,user)=>{
        if(err){
            //next(err);
        }
        console.log("user");
        if(!user){
            console.log("not user");
            var newUser=new User(req.body);
            console.log(newUser);
            console.log("new user");
            newUser.save((err,save)=>{
                if(err){
                   // next(err);
                }else{
                  // res.json({success:true,status:'User Added Successfuly'})
                   res.json({id :newUser._id}) ;
                }
            
            })
        }
        else{
            res.json({id :user._id}) ;

           // res.json({success:true,status:'User Retreived Successfuly'}) ;
        }

    
    })}



    


   