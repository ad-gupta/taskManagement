import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  status: {
    type: String,
    enum: ["Pending", "Finished"],
    default: "Pending",
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  totalTimeToFinish: {
    type: Number,
    required: true,
    default: function () {
      if (this.startTime && this.endTime) {
        const duration = (this.endTime - this.startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
        return parseFloat(duration.toFixed(2));
      }
      return 0;
    },
  },
});


export default mongoose.model("Task", taskSchema);
