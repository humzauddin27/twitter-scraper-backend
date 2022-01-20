exports.CLIENT_ORIGIN =
  process.env.NODE_ENV === "production"
    ? "https://humzas-twitter-scraper.herokuapp.com"
    : "http://localhost:3000";
