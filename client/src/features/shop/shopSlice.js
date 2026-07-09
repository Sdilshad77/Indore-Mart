import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import shopService from './shopService';

let shopExists = JSON.parse(localStorage.getItem('shop'))

const initialState = {
    shopLoading: false,
    shopSuccess: false,
    shopError: false,
    shopErrorMessage: "",
    shop: shopExists || {},
    shopProducts: [],
    shopOrders: [],
    shopCoupons: [],
    edit: { shop: {}, isEdit: false }
}

const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        productEdit: (state, action) => {
            return {
                ...state,
                edit: { product: action.payload, isEdit: true }
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMyShopDetails.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(getMyShopDetails.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shop = action.payload
                state.shopError = false
            })
            .addCase(getMyShopDetails.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(getAllProducts.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopProducts = action.payload
                state.shopError = false
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(getMyShopOrders.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(getMyShopOrders.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopOrders = action.payload
                state.shopError = false
            })
            .addCase(getMyShopOrders.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(getAllCoupons.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(getAllCoupons.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopCoupons = action.payload
                state.shopError = false
            })
            .addCase(getAllCoupons.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(addProduct.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopProducts = [action.payload, ...state.shopProducts]
                state.shopError = false
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(updateProduct.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopProducts = state.shopProducts.map(product => product._id === action.payload._id ? action.payload : product),
                    state.edit = { product: {}, isEdit: false }
                state.shopError = false
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(updateOrder.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopOrders = state.shopOrders.map(order => order._id === action.payload._id ? action.payload : order),
                    state.shopError = false
            })
            .addCase(updateOrder.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
            .addCase(createCoupon.pending, (state, action) => {
                state.shopLoading = true
                state.shopSuccess = false
                state.shopError = false
            })
            .addCase(createCoupon.fulfilled, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = true
                state.shopCoupons = [action.payload, ...state.shopCoupons]
                state.shopError = false
            })
            .addCase(createCoupon.rejected, (state, action) => {
                state.shopLoading = false
                state.shopSuccess = false
                state.shopError = true
                state.shopErrorMessage = action.payload
            })
    }
});

export const { productEdit } = shopSlice.actions

export default shopSlice.reducer



// Fetch My Shop Details
export const getMyShopDetails = createAsyncThunk("FETCH/SHOP/DETAILS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await shopService.fetchShopDetails(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch shop details'
        return thunkAPI.rejectWithValue(message)
    }

})

// Fetch All Products
export const getAllProducts = createAsyncThunk("FETCH/PRODUCTS", async (_, thunkAPI) => {

    // Prefer Redux state (always up-to-date); fall back to localStorage cache
    const stateShopId = thunkAPI.getState().shop.shop?._id
    const localShop = localStorage.getItem('shop')
    let shopId = stateShopId || (localShop ? JSON.parse(localShop)._id : null)

    if (!shopId) return thunkAPI.rejectWithValue("Shop not found")

    try {
        return await shopService.fetchAllProducts(shopId)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch products'
        return thunkAPI.rejectWithValue(message)
    }

})


// Fetch My Shop Orders
export const getMyShopOrders = createAsyncThunk("FETCH/SHOP/ORDERS", async (_, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await shopService.fetchAllOrders(token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch orders'
        return thunkAPI.rejectWithValue(message)
    }

})


// Fetch All Shop Coupons
export const getAllCoupons = createAsyncThunk("FETCH/SHOP/COUPONS", async (_, thunkAPI) => {

    let shopId = thunkAPI.getState().shop.shop._id

    try {
        return await shopService.fetchAllCoupons(shopId)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to fetch coupons'
        return thunkAPI.rejectWithValue(message)
    }

})

// Add Product
export const addProduct = createAsyncThunk("ADD/SHOP/PRODUCT", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await shopService.createProduct(formData, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to add product'
        return thunkAPI.rejectWithValue(message)
    }

})


// Update Product
export const updateProduct = createAsyncThunk("UPDATE/SHOP/PRODUCT", async (formData, thunkAPI) => {
    let token = thunkAPI.getState().auth.user.token
    try {
        return await shopService.productUpdate(formData, token)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to update product'
        return thunkAPI.rejectWithValue(message)
    }

})


// Update Order 
export const updateOrder = createAsyncThunk("UPDATE/SHOP/ORDER", async (orderDetails, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await shopService.orderUpdate(token, orderDetails)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to update order'
        return thunkAPI.rejectWithValue(message)
    }

})


// Add Coupon 
export const createCoupon = createAsyncThunk("ADD/SHOP/COUPON", async (couponDetails, thunkAPI) => {

    let token = thunkAPI.getState().auth.user.token

    try {
        return await shopService.addCoupon(token, couponDetails)
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Failed to create coupon'
        return thunkAPI.rejectWithValue(message)
    }

})