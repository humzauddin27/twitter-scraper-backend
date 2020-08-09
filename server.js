if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const formData = require("express-form-data");
const cors = require("cors");
const Twitter = require("twitter");
const { CLIENT_ORIGIN } = require("./config");

const client = new Twitter({
  bearer_token: process.env.BEARER_TOKEN,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

const app = express();

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(formData.parse());

app.post("/search", async (req, res) => {
  let tweets = [];
  let tweetsExhausted = false;

  async function fillTweets() {
    while (tweets.length < 1000) {
      let params = {
        q: req.body[0],
        count: 100,
        result_type: "recent"
      };
      if (tweets.length > 0) {
        params["max_id"] = tweets[tweets.length - 1].id - 1;
      }
      let response = await client.get("search/tweets", params);
      tweets = tweets.concat(response.statuses);
      if (response.statuses.length < 100) {
        tweetsExhausted = true;
        break;
      }
    }
  }

  function filterTweets() {
    const hash = {};
    const arr = tweets.slice().filter(tweet => {
      const id =
        tweet && tweet.retweeted_status ? tweet.retweeted_status.id : tweet.id;
      if (!hash[id]) {
        hash[id] = 1;
        return true;
      } else {
        return false;
      }
    });
    return arr.slice(0, 1000);
  }

  while (true) {
    await fillTweets();
    tweets = filterTweets();
    if (tweets.length >= 1000 || tweetsExhausted) {
      break;
    }
  }

  return res.json(tweets);
});

app.listen(process.env.PORT || 8080, () => console.log("👍"));
