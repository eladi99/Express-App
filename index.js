const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const home = require('./routes/home');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});