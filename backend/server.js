require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");

const mongoose = require("mongoose");
const workoutRouter = require("./routes/workouts");
const userRouter = require("./routes/user");

//Middleware

app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//Routes
app.use("/api/workouts", workoutRouter);
app.use("/api/user", userRouter);

//Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        "Connected to DB & Server listening to port",
        process.env.PORT
      );
    });
  })
  .catch((error) => {
    console.log(error);
  });
