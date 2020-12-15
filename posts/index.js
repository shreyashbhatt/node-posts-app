const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4000;

const posts = {};

app.get('/posts', function(req, res) {
    res.send(posts);
});

app.post('/posts', async function(req, res) {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;
    posts[id] = {
        id, 
        title
    };

    await axios.post("http://localhost:4005/events", {type: "PostCreated", data: posts[id] });
    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log("Event received : ", req.body.type);

    res.send({});
});
app.listen(PORT, () => {
    console.log("Listening on port : " + PORT);
});