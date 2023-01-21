const Newsletters = require("../models/Newsletter.model");

const User = require("../models/user.model");




exports.createNewsletters = (req, res, next) => {
    const Newsletter = new Newsletters({
        ...req.body
    });
    // console.log(req.body.user._id)
    const user = User.findOneAndUpdate({ _id: req.body.user._id }, { $push: { newsletter: Newsletter._id } }).exec();
    console.log(user)

    Newsletter.save().then(() => {
        res.status(200).json({ message: 'objet crée' })
    }).catch(error => res.status(400).json({ error }));
}
exports.modifyNewsletter = async (req, res, next) => {
    Newsletters.updateOne({ _id: req.params.id }, { ...req.body }).then(res.status(200).json({ message: "update done" })).catch(error => res.status(404).json({ error }));
}

exports.getAll = (req, res, next) => {
    Newsletters.find().then(Newsletter => res.status(200).json(Newsletter)).catch(error => res.status(400).json({ error }));
}


exports.getOneNewsletter = (req, res, next) => {
    Newsletters.findOne({ _id: req.params.id }).then(Newsletter => res.status(200).json(Newsletter)).catch(error => res.status(404).json({ error }));
}



exports.deleteOneNewsletter = async (req, res, next) => {
    try {
        const NewsletterId = req.params.id;
        await Newsletters.deleteOne({ _id: NewsletterId });
        const filter = { newsletter: NewsletterId };
        await User.findOneAndUpdate(filter, {
            $pull: {
                newsletter: NewsletterId,
            },
        });

        return res.status(200).json({ message: "Newsletter deleted" }).send();
    } catch (error) {
        console.log(error);
    }


};