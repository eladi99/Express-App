const express = require('express');
const genre_db = require('../database/genre_db');
const Joi = require('joi');

let genres = genre_db.genres;
const router = express.Router();

const GENRE_SCHEMA = Joi.object().keys({
    id: Joi.number().integer().min(1).max(6).required(),
    name: Joi.string().alphanum().regex(/[A-Za-z]{3,10}/).required()
});


router.get('/', (req, res) => {
    res.send(genres);
});


router.get('/:id', (req, res) => {
    const qid = req.params.id;
    
    const genre = genres.find((g) => g.id == parseInt(qid));
    if (!genre) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }

    res.send(genre);
});


router.post('/', (req, res) => {
    const q_name = req.body;
    if (genres.find((g) => g.name == q_name)) {
        return res.status(400).send(`Genre name "${q_name}" already exists.`);
    }

    const new_genre = { id: genre_db.generate_ID(genres), name: q_name };
    genres.push(new_genre);
    res.send(`Posted ${JSON.stringify(new_genre)} successfully.`);
});


router.put('/', (req, res) => {
    const result = Joi.validate(req.body, GENRE_SCHEMA);
    if (result.error) {
        return res.status(400).send(result.error);
    }

    const { id: genre_id, name: genre_name } = result.value;

    if (genres.find(g => g.id == genre_id)) {
        return res.status(400).send(`Genre ID ${genre_id} already exists.`);
    }

    if (genres.find(g => g.name == genre_name)) {
        return res.status(400).send(`Genre name ${genre_name} already exists.`);
    }

    const new_genre = { id: genre_id, name: genre_name };
    genres.push(new_genre);
    res.send(`Posted ${JSON.stringify(new_genre)} successfully.`);
});


router.delete('/', (req, res) => {
    const q_name = req.body;
    const idx = genres.find((g) => g.name == q_name);
    if (!idx) {
        return res.status(404).send(`Genre name ${q_name} does not exist.`);
    }

    const deleted_genre = genres.splice(idx, 1);
    res.send(`Deleted ${JSON.stringify(deleted_genre)} successfully.`);
});

module.exports = router;