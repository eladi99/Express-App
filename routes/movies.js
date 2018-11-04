const express = require('express');
const Movie = require('../models/movie');
const { Genre } = require('../models/genre');

const router = express.Router();

router.get('/', async (_, res) => {
    const movies = await Movie.find().sort('name').select('-__v -genre.__v');
    res.send(movies);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    let movie;
    try {
        movie = await Movie.findById(id).select('-__v');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.send(`Movie ID ${id} is invalid.`);
        }
        return res.send(err.message);
    }

    if (!movie) {
        return res.status(404).send(`Movie ID ${id} does not exist.`);
    }

    res.send(movie);
});


router.post('/', async (req, res) => {
    const { title, genre: genreID, numberInStock, dailyRentalRate } = req.body;
    if (!genreID) {
        return res.status(400)
            .send('Genre is required. Please add genre ID to your request body.')
    }
    
    let genre;
    try {
        genre = await Genre.findById(genreID).select('-__v');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.send(`Genre ID ${id} is invalid.`);
        }

        return res.send(err.message);
    }

    if (!genre) {
        return res.status(404)
            .send(`Genre ID ${genreID} does not exist. Movie could not be posted.`);
    }

    const movie = await new Movie({
        title: title,
        genre: genre,
        numberInStock: numberInStock,
        dailyRentalRate: dailyRentalRate
    });
    try {
        await movie.save();     
    } 
    catch(err) {
        res.status(400);
        if (err.name == 'MongoError' && err.code == 11000) {
            return res.send(`Movie title "${title}" already exists.`);
        }
        
        return res.send(err);
    }

    res.send(`Posted ${JSON.stringify(movie)} successfully.`);
});


router.put('/', async (req, res) => {
    const { id: movieID, genreID } = req.body;

    if (genreID) {
        let genre;
        try {
            genre = await Genre.findById(genreID).select('-__v');
        }
        catch(err) {
            res.status(400);
            if (err.kind == 'ObjectId' && err.path == "_id") {
                return res.send(`Genre ID ${genreID} is invalid.`);
            }
            return res.send(err.message);
        }

        if (!genre) {
            return res.status(404)
                .send(`Genre ID ${genreID} does not exist. Could not execute the request.`);
        }
        
        req.body.genre = genre;
    }

    let movie;
    try {
        movie = await Movie
            .findOneAndUpdate({ _id: movieID }, req.body, { new: true })
            .select('title genre.name numberInStock dailyRentalRate');
    }
    catch(err) {
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.status(400).send(`Movie ID ${movieID} is invalid.`);
        }

        return res.status(404).send(err);
    }
    
    if (!movie) {
        return res.status(404).send(`Movie ID ${movieID} does not exist.`);
    }
    
    res.send(`Updated ${JSON.stringify(movie)} successfully.`);
});


router.delete('/', async (req, res) => {
    const { id } = req.body;

    let movie;
    try {
        movie = await Movie
            .findOneAndDelete({ _id: id })
            .select('title');
    }
    catch(err) {
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.status(400).send(`Movie ID ${id} is invalid.`);
        }

        return res.status(404).send(err);
    }

    if (!movie) {
        return res.status(404).send(`Movie ID ${id} does not exist.`)
    }
    
    res.send(`Deleted ${JSON.stringify(movie)} successfully.`)
});

module.exports = router;