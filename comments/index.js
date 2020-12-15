const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 4001;

const commentsByPostId = {};

app.get('/posts/:id/comments', function(req, res) {
    const comments = commentsByPostId[req.params.id] || []
    res.status(200).send(comments);
});

app.post('/posts/:id/comments', async function(req, res) {
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const postId = req.params.id;

    const comments = commentsByPostId[postId] || [];
    comments.push({ id: commentId, content, status: 'pending'});

    commentsByPostId[postId] = comments;
    await axios.post("http://localhost:4005/events", {type: "CommentCreated", data: { id: commentId, content, postId}});
    res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', async (req, res) => {
    console.log("Event received : ", req.body.type);
    const { type, data } = req.body;
    if(type === 'CommentModerated') {
        const { postId, id, status, content } = data;
        const comments = commentsByPostId[postId];

        const comment = comments.find( comment => {
            return comment.id === id;
        });
        comment.status = status;
        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id,
                postId,
                status,
                content
            }
        });
    }
    res.send({});
});

app.listen(PORT, () => {
    console.log("Listening on port : " + PORT);
});