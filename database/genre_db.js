const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 31
    }
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;