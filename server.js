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
  for (let i = 0; i < 10; i++) {
    let params = {
      q: req.body[0],
      count: 100,
      result_type: "recent"
    };
    if (i > 0) params["max_id"] = tweets[tweets.length - 1].id;
    let response = await client.get("search/tweets", params);
    tweets = tweets.concat(response.statuses);
    if (response.statuses.length < 100) break;
  }

  return res.json(tweets);
});

app.listen(process.env.PORT || 8080, () => console.log("👍"));
