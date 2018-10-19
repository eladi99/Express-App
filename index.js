const Express = require('express');
const bodyParser = require('body-parser');

const app = new Express();
app.use(bodyParser.json());
app.use(bodyParser.text());

let genres = [
    {
        id: 3810,
        name: 'mystery'
    },
    {
        id: 2943,
        name: 'thriller'
    }
];

function generate_ID(genres) {
    return Math.round(genres.reduce((sum, g) => sum + g.id, 0) / 9);
}

app.get('/', (req, res) => {
    res.send('Welcome to VIDLY!!!');
});

app.get('/api/genres', (req, res) => {
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
    const qname = req.body;

    if (genres.find((g) => g.name == qname)) {
        return res.status(400).send(`Genre name "${qname}" already exists.`);
    }

    const new_genre = { id: generate_ID(genres), name: qname };
    genres.push(new_genre);
    res.send(`Posted ${JSON.stringify(new_genre)} successfully.`);
});

app.put('/api/genres', (req, res) => {

});

app.delete('/api/genres', (req, res) => {

});

const port = process.env.port || 8080;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});