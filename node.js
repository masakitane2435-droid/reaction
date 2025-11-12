const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(event => {
    if(event.type === 'message' && event.message.type === 'text'){
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: `あなたはこう言いました: ${event.message.text}`,
      });
    }
    return Promise.resolve(null);
  }))
  .then(() => res.sendStatus(200))
  .catch(err => { console.error(err); res.sendStatus(500); });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));
