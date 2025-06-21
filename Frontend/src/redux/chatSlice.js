import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        onlineUsers: [],
        messages: [],
    },
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        removeOnlineUser: (state, action) => {
            // Correct way to remove user with Immer
            state.onlineUsers = state.onlineUsers.filter(userId => userId !== action.payload);
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    }
});

export const { setOnlineUsers, setMessages, removeOnlineUser } = chatSlice.actions;
export default chatSlice.reducer;