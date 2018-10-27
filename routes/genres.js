const express = require('express');
const Genre = require('../models/genre');

const router = express.Router();

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
        return res.send(err.message);
    }

    if (!genre) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }

    res.send(genre);
});


router.post('/', async (req, res) => {
    const q_name = req.body;
    
    // Maybe validation covers this case
    if (await Genre.find({ name: q_name }).length > 0) {
        return res.status(400).send(`Genre name "${q_name}" already exists.`);
    }
    
    const genre = await new Genre({ name: q_name });
    try {
        genre.save();         
    } 
    catch(err) {
        res.status(400).send(err);
    }

    res.send(`Posted ${JSON.stringify(genre)} successfully.`);
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
    const genre = await Genre.findOneAndRemove({ name: req.body }).select('id name');
    res.send(`Deleted ${JSON.stringify(genre)} successfully.`)
});

module.exports = router;