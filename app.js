require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const path = require("path");
const { PORT = 3000 } = process.env;

const { notFoundHandler, errorHandler } = require("./middlewares");

app.use(morgan("dev"));
app.use(express.json());

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "views")));

app.use("/api/v1/auth", require("./routes/auth.routes"));

// server error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => console.log("Running on port", PORT));
