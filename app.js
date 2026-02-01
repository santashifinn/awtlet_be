const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const apiRouter = require("./routes/api-router");
const {
  generalErrorHandler,
  postgresErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require("./errors");

app.use(express.json());

app.use("/api", apiRouter);

app.use(postgresErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

app.all("/{*any}", generalErrorHandler);

module.exports = app;
