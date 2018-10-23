const express = require('express');
const bodyParser = require('body-parser');

const genres = require('./routes/genres');
const home = require('./routes/home');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use('/', home);
app.use('/api/genres', genres);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});