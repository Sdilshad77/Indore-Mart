import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    chat: {},
    chatLoading: false,
    chatSuccess: false,
    chatError: false,
    chatErrorMessage: ""
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        resetChat: (state) => {
            state.chatSuccess = false
            state.chatError = false
            state.chatErrorMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state, action) => {
                state.chatLoading = true
                state.chatSuccess = false
                state.chatError = false
                state.chatErrorMessage = ""
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.chatLoading = false
                state.chatSuccess = true
                state.chat = action.payload
                state.chatError = false
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.chatLoading = false
                state.chatSuccess = false
                state.chatError = true
                state.chatErrorMessage = action.payload
            })
    }
});

export const { resetChat } = chatSlice.actions

export default chatSlice.reducer


export const sendMessage = createAsyncThunk("CHAT/SEND_MESSAGE", async (message, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    try {
        const response = await axios.post("/api/chat", { question: message }, options)
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Something went wrong. Please try again.'
        return thunkAPI.rejectWithValue(message)
    }

})