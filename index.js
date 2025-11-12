const express = require('express');
const { Client, middleware } = require('@line/bot-sdk');
const stringSimilarity = require('string-similarity');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new Client(config);
const app = express();

// 環境変数でキーワードと類似度閾値を設定
const KEYWORDS = (process.env.KEYWORDS || "あそれあそれガイジが出た出たよよいのよいｗあガガイのガイあそれガガイのガイあよいしょガガイのガガイのガガイのガイｗあガイジガイジガイジガイジよいしょよいしょよいしょよいしょｗあっガヰ、あガヰ、あガヰガヰガヰあガガイのガイあそれガガイのガイあよいしょガガイのガガイのガガイのガイｗあガイジガイジガイジガイジよいしょよいしょよいしょよいしょｗあガガイのガイあそれガガイのガイあよいしょガガイのガガイのガガイのガイｗあガイジガイジガイジガイジよいしょよいしょよいしょよいしょｗ").split(",");
const THRESHOLD = parseFloat(process.env.THRESHOLD || "0.7");

// Webhookエンドポイント
app.post('/webhook', middleware(config), (req, res) => {
  Promise.all(req.body.events.map(async (event) => {
    if(event.type === 'message' && event.message.type === 'text') {
      const text = event.message.text;
      const match = KEYWORDS.some(k => stringSimilarity.compareTwoStrings(k, text) >= THRESHOLD);
      
      if(match){
        return client.replyMessage(event.replyToken, {
          type: 'text',
          text: `反応しました: ${text}`
        });
      }
    }
    return null; // 該当しない場合は無反応
  }))
  .then(() => res.sendStatus(200))
  .catch(err => { console.error(err); res.sendStatus(500); });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`LINE bot server running on port ${PORT}`);
});
