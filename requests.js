const app = require('./index');
const genre_db = require('./genre_db');
let genres = genre_db.genres;

const Joi = require('joi');
const GENRE_SCHEMA = Joi.object().keys({
    id: Joi.number().integer().min(1).max(6).required(),
    name: Joi.string().alphanum().regex(/[A-Za-z]{3,10}/).required()
});

app.get('/', (req, res) => {
    res.send('Welcome to VIDLY!!!');
});


app.get('/api/genres/', (req, res) => {
    res.send(genres);
});


app.get('/api/genres/:id', (req, res) => {
    const qid = req.params.id;
    
    const genre = genres.find((g) => g.id == parseInt(qid));
    if (!genre) {
        return res.status(404).send(`Genre ID ${qid} does not exist.`);
    }

    res.send(genre);
});


app.post('/api/genres/', (req, res) => {
    const q_name = req.body;
    if (genres.find((g) => g.name == q_name)) {
        return res.status(400).send(`Genre name "${q_name}" already exists.`);
    }

    const new_genre = { id:genre_db.generate_ID(genres), name: q_name };
    genres.push(new_genre);
    res.send(`Posted ${JSON.stringify(new_genre)} successfully.`);
});


app.put('/api/genres/', (req, res) => {
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


app.delete('/api/genres/', (req, res) => {
    const q_name = req.body;
    console.log(q_name);
    const idx = genres.find((g) => g.name == q_name);
    if (!idx) {
        return res.status(404).send(`Genre name ${q_name} does not exist.`);
    }

    const deleted_genre = genres.splice(idx, 1);
    res.send(`Deleted ${JSON.stringify(deleted_genre)} successfully.`);
});
