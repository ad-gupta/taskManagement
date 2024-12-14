import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./Routes/user.js"
import tasksRouter from "./Routes/task.js"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';

const app = express();

dotenv.config();

const connectToDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "taskManagement" })
    .then(() => {
      console.log("connected to db");
    })
    .catch((err) => console.log(err));
};

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use("/api/user", userRouter);
app.use("/api/tasks", tasksRouter);
// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is running on port ${process.env.PORT}`);
  connectToDB();
});
