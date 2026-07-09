import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import productService from './productService';

const initialState = {
    products: [],
    product: null,
    productShops: [],
    productShop: null,
    productLoading: false,
    productSuccess: false,
    productError: false,
    productErrorMessage: ""
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.products = action.payload
                state.productError = false
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(getProduct.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProduct.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.product = action.payload
                state.productError = false
            })
            .addCase(getProduct.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(getProductShops.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProductShops.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.productShops = action.payload
                state.productError = false
            })
            .addCase(getProductShops.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
            .addCase(getProductShop.pending, (state, action) => {
                state.productLoading = true
                state.productSuccess = false
                state.productError = false
            })
            .addCase(getProductShop.fulfilled, (state, action) => {
                state.productLoading = false
                state.productSuccess = true
                state.productShop = action.payload
                state.productError = false
            })
            .addCase(getProductShop.rejected, (state, action) => {
                state.productLoading = false
                state.productSuccess = false
                state.productError = true
                state.productErrorMessage = action.payload
            })
    }
});

export const { } = productSlice.actions

export default productSlice.reducer


// GET PRODUCTS
export const getProducts = createAsyncThunk("FETCH/PRODUCTS", async (_, thunkAPI) => {
    try {
        return await productService.fetchProducts()
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// GET PRODUCT
export const getProduct = createAsyncThunk("FETCH/PRODUCT", async (pid, thunkAPI) => {
    try {
        return await productService.fetchProduct(pid)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// GET SHOPS
export const getProductShops = createAsyncThunk("FETCH/SHOPS", async (_, thunkAPI) => {
    try {
        return await productService.fetchShops()
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})

// GET SHOPS
export const getProductShop = createAsyncThunk("FETCH/SHOP", async (id, thunkAPI) => {
    try {
        return await productService.fetchShop(id)
    } catch (error) {
        const message = error.response.data.message
        return thunkAPI.rejectWithValue(message)
    }
})