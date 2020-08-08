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
  client.get(
    "search/tweets",
    {
      q: req.body[0],
      count: 100,
      result_type: "recent"
    },
    function(error, tweets, response) {
      if (error) console.error(error);

      return res.json(tweets.statuses);
    }
  );
});

app.listen(process.env.PORT || 8080, () => console.log("👍"));
