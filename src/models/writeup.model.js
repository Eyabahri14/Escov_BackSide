const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    id: {type: String, required: true},
    title: {type: String, required: true},
    categorie: {type: String, enum: ['Forensics', 'Cryptography', 'Web Exploitation', 'Binary Exploitation', 'Reverse Engineering','Misc'], default: 'Misc'},
    content: {type: String, required: true},
    flag: {type: String, required: true},
    description: {type: String, required: true},

}, {timestamps: true})

module.exports = mongoose.model('Writeup', schema);