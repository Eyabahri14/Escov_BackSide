const User = require("../models/user.model");
const Otp = require("../models/otp.model");
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var sendMail = require('../mail/mail')

exports.getCheck = (req, res, next) => {
    res.json({ msg: "All ok" })
}



exports.register = async (req, res) => {

    const salt = await bcrypt.genSalt(10);
    var hashedPassword= bcrypt.hashSync(req.body.password, salt);
    
    const usernameExist=await User.findOne({username:req.body.username});

    const emailExist=await User.findOne({email:req.body.email});

    if(usernameExist) return res.status(400).send('username already exist');

    if(emailExist) return res.status(400).send('Email already exist');

    
        var user = new User({
            username: req.body.username,
            email: req.body.email,
            name: req.body.name,
            contact: req.body.contact,
            password: hashedPassword
          
        }) 
        try {
            
            await user.save()
            res.send({User:user._id})  
          }
          catch (err) {
              console.log(err)
      
          }
    }


    exports.logIn = (req, res) => {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
                console.log(err)
                res.json({ msg: "Somthing went wrong" });
            }
            else {
                if (!user) {
                    res.json({ msg: 'Invalid Email!!' })
                }
                else {
                    bcrypt.compare(req.body.password, user.password).then(match => {
                        if (match) {
                            console.log("login sucesssss");
                            let payload = { subject: user._id, email: user.email }
                            let token = jwt.sign(payload, process.env.SECRETKEY, {
                                expiresIn: "24h"
                            })
                            res.status(200).json({ token: token,idUser:user._id,username:user.username,email:user.email,contact:user.contact})
                          
                        }
                        else {
                            console.log("incoreect passss");
                            res.json({ msg: 'Incorrect password!!' })
                        }
                    }).catch(err => {
                        console.log(err)
                        console.log("somthing wrong");
                        res.json({ msg: 'Somthing went wrong' })
                    })
                }
            }
        })
    }


    function getEmail(email) {
        Otp.find({ email: email }, (err, otps) => {
    
            if (err) {
                console.log("err in finding email ");
            }
            if (otps.length != 0) {
                console.log("yes in delete");
                Otp.deleteOne({ email: email }, (err) => {
                    if (err)
                        console.log("err in delete");
                }
                )
            }
        })
    }
    

    exports.Reset = (req, res) => {
        User.find({ email: req.body.email }, async (err, users) => {
    
            if (err) {
                console.log("err in finding email ");
                res.json({ msg: "some error!" });
            }
            if (users.length == 0) {
                console.log("user does not exist with this email at forgot password!!");
                res.json({ msg: "user does not exist with this email" });
                console.log(res)
            }
            else {
                Otp.findOne({ email: req.body.email }, async (err, otp) => {
                    if (err) {
                        console.log("err in finding email ");
                        res.json({ msg: "some error!" });
                    }
                    if (otp) {
                        console.log(otp.otp);
                        sendMail(req.body.email, otp.otp);
                        setTimeout(async function () {
                            console.log("timeout (2min)");
                            var y = await getEmail(req.body.email)
                        }, 2 * 60000);
                        res.status(201).json({ message: "all ok otp has been send" });
                    }
                    else {
                        var email = req.body.email
                        var x = await getEmail(req.body.email)
                        setTimeout(async function () {
                            console.log("timeout (2min)");
                            var y = await getEmail(email)
                        }, 2 * 60000);
                        var a = Math.floor(1000 + Math.random() * 9000);
                        var otp = new Otp({
                            otp: a,
                            email: req.body.email
                        });
                        // console.log("otp =", otp);
                        try {
                            doc = otp.save();
                            sendMail(otp.email, otp.otp);
                            res.status(201).json({ message: "all ok otp has been send" });
                        }
                        catch (err) {
                            res.json({ msg: "some error!" });
                        }
                    }
                })
    
            }
        })
    }
    

    exports.resestPasswordDone = (req, res) => {
        User.findOne({ email: req.body.email }, async (err, user) => {
            if (err) {
                console.log(err)
                res.json({ msg: "Somthing went wrong" });
            }
            else {
                if (!user) {
                    res.json({ msg: 'User does not exist with this email!!' })
                }
                else {
                    Otp.findOne({ email: req.body.email }, async (err, otps) => {
    
                        if (err) {
                            res.json({ msg: "Somthing went wrong" });
                        }
                        if (!otps) {
                            res.json({ msg: "Otp has been expired!" });
                        }
                        else {
                            var otp = otps.otp;
                            if (otp != req.body.otp) {
                                res.json({ msg: "Invalid Otp!!!" });
                            }
                            else {
                                const salt = await bcrypt.genSalt(10);
                                var hashedPassword= bcrypt.hashSync(req.body.password, salt);
                                var x = await getEmail(req.body.email)
                                User.findOneAndUpdate({ email: req.body.email },
                                    { password: hashedPassword}, function (err, user) {
                                        console.log(1);
                                        if (err) {
                                            console.log(err)
                                            res.json({ msg: "Somthing went wrong" });
                                        }
                                        else {
                                            res.json({ message: "password updated!!" });
                                        }
                                    });
                            }
                        }
                    })
    
    
                }
            }
        })
    }
    