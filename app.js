const Controllers = require("./controllers");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { initiateForestAdmin } = require('./lib/forestAdminService');
const { User } = require("./models");

const app = express();

if (process.env.BO == 'true') {
    initiateForestAdmin(app)
}

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", function (req, res, next) {
  res.json("API");
});

app.use("/users", Controllers.User);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;
