import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        likeNotifications: [],
    },
    reducers: {
        setNotifications: (state, action) => {
            if (action.payload.type === "like") {
                state.likeNotifications.push(action.payload);
            }else if(action.payload.type === "dislike"){
                state.likeNotifications = state.likeNotifications.filter((notification) => notification.userId !== action.payload.userId && notification.postId !== action.payload.postId);
            }
        },
        clearNotifications: (state) => { state.likeNotifications = [] } // Clear notifications on logout or other actions as needed
    },
});

export const { setNotifications, clearNotifications } = notificationSlice.actions; // Export the clearNotifications action as well
export default notificationSlice.reducer;
