import express from "express";
import {
  createTask,
  getTasks,
  getTask,
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/task/get", protect, getTasks);
router.get("/task/get/:id", protect, getTask);
export default router;
