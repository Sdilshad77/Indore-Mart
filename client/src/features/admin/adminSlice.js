import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import adminService from './adminService';

const initialState = {
    adminLoading: false,
    adminSuccess: false,
    adminError: false,
    adminErrorMessage: "",
    allUsers: [],
    allOrders: [],
    allShops: []
}

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllUsers.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllUsers.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.allUsers = action.payload
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllUsers.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllOrders.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllOrders.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.allOrders = action.payload
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllOrders.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(getAllShops.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllShops.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.allShops = action.payload
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(getAllShops.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(shopUpdate.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(shopUpdate.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.allShops = state.allShops.map(shop => shop._id === action.payload._id ? action.payload : shop)
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(shopUpdate.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(userUpdate.pending, (state, action) => {
                state.adminLoading = true
                state.adminSuccess = false
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(userUpdate.fulfilled, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = true
                state.allUsers = state.allUsers.map(user => user._id === action.payload._id ? action.payload : user)
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(userUpdate.rejected, (state, action) => {
                state.adminLoading = false
                state.adminSuccess = false
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
            .addCase(orderUpdate.pending, (state) => {
                state.adminError = false
                state.adminErrorMessage = ""
            })
            .addCase(orderUpdate.fulfilled, (state, action) => {
                state.allOrders = state.allOrders.map(order =>
                    order._id === action.payload._id ? action.payload : order
                )
                state.adminError = false
            })
            .addCase(orderUpdate.rejected, (state, action) => {
                state.adminError = true
                state.adminErrorMessage = action.payload
            })
    }
});

export const { } = adminSlice.actions

export default adminSlice.reducer


// Fetch All Users
export const getAllUsers = createAsyncThunk("FETCH/ADMIN/USERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllUsers(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch users'
        return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All orders
export const getAllOrders = createAsyncThunk("FETCH/ADMIN/ORDERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllOrders(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch orders'
        return thunkAPI.rejectWithValue(message)
    }
})

// Fetch All Shops
export const getAllShops = createAsyncThunk("FETCH/ADMIN/SHOPS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.fetchAllshops(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch shops'
        return thunkAPI.rejectWithValue(message)
    }
})


// Update Shop
export const shopUpdate = createAsyncThunk("UDPATE/ADMIN/SHOPS", async (shopDetails, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.updateShop(shopDetails, token)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// Update Order
export const orderUpdate = createAsyncThunk("UPDATE/ADMIN/ORDER", async (orderDetails, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.updateOrder(orderDetails, token)
    } catch (error) {
        const message = error.response?.data?.message || 'Failed to update order'
        return thunkAPI.rejectWithValue(message)
    }
})

// Update User
export const userUpdate = createAsyncThunk("UDPATE/ADMIN/USER", async (userDetails, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await adminService.updateUser(userDetails, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to update user'
        return thunkAPI.rejectWithValue(message)
    }
})