const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());
const posts = {};

const _handleEvent = (eventType, data) => {
    if(eventType === 'PostCreated') {
        posts[data.id] = {...data, comments: []};
        // posts[data.id].comments = [];
    }
    
    if(eventType === 'CommentCreated') {
        const comment = {id: data.id, content: data.content, status: data.status};
        posts[data.postId].comments.push(comment);
    }

    if(eventType === 'CommentUpdated') {
        const { id, postId, content, status } = data;
        const post = posts[postId];
        const comment = post.comments.find(comment => comment.id === id);
        comment.status = status;
    }
}
app.get('/posts', (req, res) => {
    res.status(200).send(posts);
});

app.post('/events', (req, res) => {
    const { type: eventType, data } = req.body;
    _handleEvent(eventType, data);
    console.log(posts);
    res.send({});
});

app.listen(4002, async () => {
    console.log("Listening on 4002");

    const res = await axios.get("http://localhost:4005/events");

    for(let event of res.data) {
        console.log("Processing event: ", event.type);
        _handleEvent(event.type, event.data);
    }
});