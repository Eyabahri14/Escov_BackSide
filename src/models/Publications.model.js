const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    titre: { type: String, required: false },
    description: { type: String, required: true },
    prix: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    heure: { type: String, required: true },
    disable: { type: Boolean ,default : false},
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true })

module.exports = mongoose.model('Publications', schema);

