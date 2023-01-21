const Publications = require("../models/Publications.model");

const Newsletters = require("../models/Newsletter.model");

const User = require("../models/user.model");
var nodemailer = require('nodemailer');


async function countposts(emaill) {
    const user = await User.find({ email: emaill }).populate("publication");
    var nb = 0;
    if (user) {

        var todayDate = new Date(); 
        user.map((c) => {
            c.publication.map((pp) => {
                if (pp["createdAt"].toDateString() === todayDate.toDateString()) {
                    nb++;
                }
            })
        });
        console.log(nb);
        return (nb);
    }
    return (nb);
}

exports.createPublications = (req, res, next) => {
    const Publication = new Publications({
        ...req.body
    });
    var testfrom = false;
    var testto = false;
    var returnedvalue = countposts(req.body.email).then(function (result) {
        console.log(result); // "normalReturn"

        if (result < 4) {
            Newsletters.find().populate("user").then(Newsletter => {
                Newsletter.forEach(element => {
                    // console.log("from");
                    element.from.forEach(elements => {
                        // console.log(elements);
                        if (elements == req.body.from) {
                            testfrom = true;
                        }

                    });
                    // console.log("to");
                    element.to.forEach(elements => {
                        // console.log(elements);
                        if (elements == req.body.to) {
                            testto = true;
                        }
                    });
                    if (testfrom == true && testto == true && element.date == req.body.date && element.nb == 0) {
                        Newsletters.updateOne({ _id: element._id }, { nb: element.nb + 1 }).exec();

                        console.log(element.user.email);
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'escov2022@gmail.com',
                                pass: 'qvkicauqlltfwacb'
                            }
                        });

                        var mailOptions = {
                            from: 'escov2022@gmail.com',
                            to: element.user.email,
                            subject: 'Un trajet correspondant a vos critères est disponible',

                            html: require('./email')(),



                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Email sent: ' + info.response);
                            }
                        });
                    }
                });

            });
            // console.log(req.body.user._id)
            // for user
            const user = User.findOneAndUpdate({ _id: req.body.user._id }, { $push: { publication: Publication._id } }).exec();
            // console.log(user)
            // for pub save
            Publication.save().then(() => {
                res.status(200).json({ message: 'objet crée' })
            }).catch(error => res.status(400).json({ error }));
        }


        else {
            res.status(400).json({ message: "Vous avez depassé le nombre limité de posts pour aujourd'hui" });
        }
    });
}



exports.modifyPublications = async (req, res, next) => {
    Publications.updateOne({ _id: req.params.id }, { ...req.body }).then(res.status(200).json({ message: "update done" })).catch(error => res.status(404).json({ error }));
}

exports.getAll = (req, res, next) => {
    Publications.find().then(Publications => res.status(200).json(Publications)).catch(error => res.status(400).json({ error }));
}


exports.latestt = (req, res, next) => {
    Publications.find({}).sort({ createdAt: -1 }).limit(3).exec(function (err, data) {
        if (err) {
            console.log(err)
        }
        else {
            res.send(data)
        }
    })
}

exports.getOnePublications = (req, res, next) => {
    Publications.findOne({ _id: req.params.id }).then(Publications => res.status(200).json(Publications)).catch(error => res.status(404).json({ error }));
}





exports.getOnePublicationsByUserId = (req, res, next) => {
    Publications.find({user: req.params.user }).then(Publications => res.status(200).json(Publications)).catch(error => res.status(404).json({ error }));
}



exports.deleteOnePublications = async (req, res, next) => {
    try {
        const PublicationsId = req.params.id;
        await Publications.deleteOne({ _id: PublicationsId });
        const filter = { publication: PublicationsId };
        await User.findOneAndUpdate(filter, {
            $pull: {
                publication: PublicationsId,
            },
        });

        return res.status(200).json({ message: "Publications deleted" }).send();
    } catch (error) {
        console.log(error);
    }


};


exports.search = async (req, res, next) => {
    console.log(req.body);

    const publication = await Publications.find({ $and: [{ date: req.body.date, from: req.body.from, to: req.body.to,disable:false }] }).populate("user");
    try {

        // Publications.find({$and: [{heure:req.body.date},{$or:[{from: req.body.from},{to:req.body.to}]}]}, function(err, publication) 
        {
            if (publication) {
                console.log(publication);
                res.json(publication);
            }


        }
    } catch (error) {
        console.log(error);
    }


}




 