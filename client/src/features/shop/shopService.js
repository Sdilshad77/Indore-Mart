import API from "../../api/axios";

const fetchShopDetails = async (token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get("/api/shop-owner", options)
    localStorage.setItem("shop", JSON.stringify(response.data))
    return response.data
}

const fetchAllProducts = async (shopId) => {
    const response = await API.get("/api/products")
    const data = response.data.filter((product) => product.shop?._id === shopId)
    return data
}

const fetchAllOrders = async (token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get(`/api/shop-owner/order`, options)
    return response.data
}

const fetchAllCoupons = async (shopId, token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get(`/api/coupons/${shopId}`, options)
    return response.data
}

const createProduct = async (formData, token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.post(`/api/shop-owner/add-product`, formData, options)
    return response.data
}

const productUpdate = async (formData, token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put(`/api/shop-owner/product/${formData._id}`, formData, options)
    return response.data
}

const orderUpdate = async (token, orderDetails) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put(`/api/shop-owner/order/${orderDetails.id}`, orderDetails, options)
    return response.data
}

const addCoupon = async (token, couponDetails) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.post(`/api/shop-owner/coupon`, couponDetails, options)
    return response.data
}

const shopService = { fetchShopDetails, fetchAllProducts, fetchAllOrders, fetchAllCoupons, createProduct, productUpdate, orderUpdate, addCoupon }

export default shopService