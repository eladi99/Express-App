const express = require('express');
const mongoose = require('mongoose');
const Genre = require('../database/genre_db');

const router = express.Router();

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));


router.get('/', async (_, res) => {
    const genres = await Genre.find().sort('name').select('id name');
    res.send(genres);
});


router.get('/:id', async (req, res) => {
    const qid = req.params.id;
    
    let genre;
    try {
        genre = await Genre.findById(qid).select('id name');
    }
    catch(err) {
        res.status(400);
        if (err.kind == 'ObjectId') {
            return res.send('Incompatible genre ID');
        }
        res.send(err.message);
    }

    if (!genre) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }

    res.send(genre);
});


router.post('/', async (req, res) => {
    const q_name = req.body;
    if (await Genre.find({ name: q_name }).length > 0) {
        return res.status(400).send(`Genre name "${q_name}" already exists.`);
    }
    
    try {
        await new Genre({ name: q_name }).save();         
    } 
    catch(err) {
        res.status(400).send(err);
    }

    res.send(`Posted ${JSON.stringify(await Genre
        .findOne({ name: q_name })
        .select('id name'))} successfully.`);
});


router.put('/', async (req, res) => {
    const { id, name } = req.body;
    const genre = await Genre
        .findByIdAndUpdate(id, { name: name }, { new: true })
        .select('id name');
    
    if (!genre) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }
    
    res.send(`Updated ${JSON.stringify(genre)} successfully.`);
});


router.delete('/', async (req, res) => {
    const deleted_genre = await Genre.findOneAndRemove({ name: req.body }).select('id name');
    res.send(`Deleted ${JSON.stringify(deleted_genre)} successfully.`)
});

module.exports = router;