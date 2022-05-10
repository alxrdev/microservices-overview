const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const { id } = req.params;

  res.send(commentsByPostId[id]);
});

app.post('/posts/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  const comments = commentsByPostId[id] || [];
  const commentId = randomBytes(4).toString('hex');
  const comment = { id: commentId, content, status: 'pending' };

  comments.push(comment);

  commentsByPostId[id] = comments;

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: { ...comment, postId: id },
  });

  return res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  console.log('Received event', type);

  if (type === 'CommentModerated') {
    const { postId, id, status } = data;

    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);

    comment.status = status;

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: { ...comment, postId },
    });
  }

  return res.send({});
});

app.listen(4001, () => {
  console.log('Listening on 4001');
});