const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.text());

module.exports = app;
require('./requests');

const port = process.env.port || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});