import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import authService from './authService';

let userExist = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: userExist || null,
    orders: [],
    shopStatus: false,
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ""
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state, action) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false   // ✅ was incorrectly set to true
                state.isError = true
                state.message = action.payload
                state.isSuccess = false
            })
            .addCase(loginUser.pending, (state, action) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.isSuccess = false
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.message = ""
                state.isSuccess = false
                state.user = null
            }).addCase(getMyOrders.pending, (state, action) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getMyOrders.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.orders = action.payload
            })
            .addCase(getMyOrders.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.isSuccess = false
            }).addCase(cancelOrder.pending, (state, action) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.orders = state.orders.map(order => order._id === action.payload._id ? action.payload : order)
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.isSuccess = false
            }).addCase(becomeShopOwner.pending, (state, action) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(becomeShopOwner.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.status = true
            })
            .addCase(becomeShopOwner.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.isSuccess = false
            })

    }
});

export const { } = authSlice.actions

export default authSlice.reducer



// Register User
export const registerUser = createAsyncThunk("AUTH/REGISTER", async (formData, thunkAPI) => {
    try {
        return await authService.register(formData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || 'Registration failed'
        return thunkAPI.rejectWithValue(message)
    }
})


// Login User
export const loginUser = createAsyncThunk("AUTH/LOGIN", async (formData, thunkAPI) => {
    try {
        return await authService.login(formData)
    } catch (error) {
        let message = error.response?.data?.message || error.message || 'Login failed'
        return thunkAPI.rejectWithValue(message)
    }
})


// Logout User
export const logoutUser = createAsyncThunk("AUTH/LOGOUT", async () => {
    localStorage.removeItem("user")
    localStorage.removeItem("shop")
})


// GET My Orders
export const getMyOrders = createAsyncThunk("AUTH/FETCH/ORDERS", async (_, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await authService.fetchMyOrders(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch orders'
        return thunkAPI.rejectWithValue(message)
    }


})


// CANCEL My Order
export const cancelOrder = createAsyncThunk("AUTH/CANCEL/ORDER", async (orderDetails, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await authService.orderCancel(token, orderDetails)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to cancel order'
        return thunkAPI.rejectWithValue(message)
    }


})


// Become Shop Owner
export const becomeShopOwner = createAsyncThunk("AUTH/SHOP/REQUEST", async (shopDetails, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await authService.requestShopApproval(token, shopDetails)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Request failed'
        return thunkAPI.rejectWithValue(message)
    }


})