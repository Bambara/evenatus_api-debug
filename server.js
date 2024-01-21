const compression = require("compression");
const express = require("express");
require("response-time");
require("axios");
const redis = require("redis");
redis.createClient();
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbClient = require("./database_client");
const app = express();
require("child_process").fork;
require("dotenv").config();
var PORT = process.env.PORT || 8085;
app.use(compression());
app.use(cors());
// app middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
/*const URL = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(URL).then(() => {
  console.log("Mongodb Connection success!");
});*/
//Connect to MongoDB
dbClient.connectDB();
app.get("/", function (req, res) {
  res.status(200).json({
    success: true,
  });
});
app.get("/api", function (req, res) {
  res.status(200).json({
    success: true,
  });
});
app.use("/api/v1/user", require("./routes/user"));
app.use("/api/v1/matches", require("./routes/event_matches"));
app.use("/api/v1/organizer", require("./routes/organizer"));
app.use("/player/unregistered", require("./routes/match_team"));
app.use("/api/v1/organization", require("./routes/organization"));
app.use("/api/v1/events", require("./routes/events"));
app.use("/api/v1/sponsor", require("./routes/sponsor"));
app.use("/api/v1/tournament", require("./routes/tournament"));
app.use("/api/v1/game", require("./routes/game"));
app.use("/api/v1/player", require("./routes/player"));
app.use("/api/v1/payment", require("./routes/payment"));
app.use("/api/v1/mspace", require("./routes/m_space"));
app.use(function (req, res, next) {
  var err = new Error("Not found");
  err.status = 404;
  next(err);
});
app.use(function (req, res, next) {
  var err = new Error("Internal Server Error");
  err.status = 500;
  next(err);
});
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
  });
});
app.listen(PORT, function () {
  console.log("Server is up and running on port number: ".concat(PORT));
});
