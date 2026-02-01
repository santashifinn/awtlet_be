const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const apiRouter = require("./routes/api-router");

const comicsRouter = require("./routes/comics-router");

const commentsRouter = require("./routes/comments-router");

const {
  generalErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/comics", comicsRouter);

app.use("/api/comments", commentsRouter);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

app.all("/{*any}", generalErrorHandler);

module.exports = app;
