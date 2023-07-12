const express = require("express");

const router = express.Router();
const {
  getWorkouts,
  getSingleWorkout,
  createWorkout,
  updateWorkout,
  deleteWorkout,
} = require("../Controllers/workoutController");

const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);
//GET all workouts
router.get("/", getWorkouts);

//GET a single workout
router.get("/:id", getSingleWorkout);

//POST a workout
router.post("/", createWorkout);

//DELETE a workout
router.delete("/:id", deleteWorkout);

//UPDATE a workout
router.patch("/:id", updateWorkout);
module.exports = router;
