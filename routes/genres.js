const express = require('express');
const Genre = require('../models/genre');

const router = express.Router();

router.get('/', async (_, res) => {
    const genres = await Genre.find().sort('name').select('name');
    res.send(genres);
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    
    let genre;
    try {
        genre = await Genre.findById(id).select('name');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.send(`Genre ID ${id} is invalid.`);
        }
        return res.send(err.message);
    }

    if (!genre) {
        return res.status(404).send(`Genre ID ${id} does not exist.`);
    }

    res.send(genre);
});


router.post('/', async (req, res) => {
    const name = req.body;
    const genre = await new Genre({ name: name });
    
    try {
        await genre.save();         
    } 
    catch(err) {
        res.status(400);
        if (err.name == 'MongoError' && err.code == 11000) {
            return res.send(`Genre name ${name} already exists.`);
        }
        
        res.send(err);
    }

    res.send(`Posted ${JSON.stringify(genre)} successfully.`);
});


router.put('/', async (req, res) => {
    let genre;
    
    try {
        genre = await Genre
            .findOneAndUpdate({ _id: req.body.id }, req.body, { new: true })
            .select('name');
    }
    catch(err) {
        if (err.kind == 'ObjectId' && err.path == "_id") {
            return res.status(400).send(`Genre ID ${req.body.id} is invalid.`);
        }
    }
    
    if (!genre) {
        return res.status(404).send(`Genre ID ${req.body.id} does not exist.`);
    }
    
    res.send(`Updated ${JSON.stringify(genre)} successfully.`);
});


router.delete('/', async (req, res) => {
    const genre = await Genre.findOneAndDelete({ _id: req.body }).select('name');
    
    if (!genre) {
        return res.status(404).send(`Genre ID ${req.body} does not exist.`)
    }
    
    res.send(`Deleted ${JSON.stringify(genre)} successfully.`)
});

module.exports = router;