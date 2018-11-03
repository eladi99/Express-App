const mongoose = require('mongoose');
const { genreSchema } = require('../models/genre');


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 31
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        max: 63,
        default: 5,
        set: num => Math.floor(num)
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        default: 0,
        max: 63
    }
}));

module.exports = Movie;