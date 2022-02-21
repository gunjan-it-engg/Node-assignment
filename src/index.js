var express = require("express");
var dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const UserRouter = require("./routes/user");
const StudentRouter = require("./routes/student");

var app = express();

mongoose.connect(process.env.URL_CONFIG);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.use(express.json());

// user route
app.use(UserRouter);
app.use(StudentRouter);

app.get("/", function (req, res) {
  res.send("Hello World!");
});
app.listen(process.env.PORT, function () {
  console.log(`app server listening on port ${process.env.PORT}!`);
});
