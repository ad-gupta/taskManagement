import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tasks: [],
    loading: false,
    success: false,
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        taskAddRequest: (state, action) => {
            state.loading = true;
        },
        taskAddSuccess: (state, action) => {
            state.loading = false;
            state.tasks = { ...state.tasks, [action.payload._id]: action.payload };
            state.success = true;
          },          
        taskAddFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = true;
        },
        deleteTask(state, action) {
            const index = state.tasks.findIndex(task => task.id === action.payload);
            if (index >= 0) {
                state.tasks.splice(index, 1);
            }
        },
        updateTask(state, action) {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index >= 0) {
                state.tasks[index] = {...state.tasks[index], ...action.payload};
            }
        },
        taskRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },
        taskSuccess: (state, action) => {
            state.loading = false;
            state.tasks = action.payload.tasks;
            state.success = action.payload.success;
        },
        taskFail: (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.success = true;
        },
    }
})

export const { taskAddRequest, taskAddSuccess, taskAddFail, deleteTask, updateTask, taskFail, taskRequest, taskSuccess } = taskSlice.actions;

export default taskSlice.reducer;