const express = require("express");
const app = express();
const PORT = 5001 || process.env.PORT;
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoute = require("./routes/user");
const patientRoute = require("./routes/patient/index");
const recordRoute = require("./routes/record");

// middlewars
app.use(express.json()); // body parser
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// End points
app.use("/api/users", userRoute);
app.use("/api/patients", patientRoute);
app.use("/api/records", recordRoute);

// Database connection
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log("Connected to Database!")
);

app.listen(PORT, () => console.log("Api Running on PORT: " + PORT));
