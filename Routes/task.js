import { Router } from "express";
import { addTask, deleteMytasks, getAllMyTasks, updateTask } from "../Controllers/task.js";
import { isAuthorised } from "../Middleware/auth.js";

const router = Router();

router.route('/').get(isAuthorised, getAllMyTasks);

router.route('/updateTask/:id').put(isAuthorised, updateTask);

router.route('/deleteTask').delete(isAuthorised, deleteMytasks);

router.route('/addTask').post(isAuthorised, addTask);

export default router;