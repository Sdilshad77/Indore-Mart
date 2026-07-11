import axios from "../../api/axios";


const API_URL = "http://localhost:8080/api/shop-owner";




const fetchShopDetails = async (token) => {

    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(API_URL, options)
    localStorage.setItem("shop", JSON.stringify(response.data))
    return response.data

}


const fetchAllProducts = async (shopId) => {
    const response = await axios.get("/api/products")

    const data = response.data.filter((product) => product.shop?._id === shopId)

    return data

}


const fetchAllOrders = async (token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/order`, options)
    return response.data
}


const fetchAllCoupons = async (shopId, token) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`/api/coupons/${shopId}`, options)
    return response.data
}


const createProduct = async (formData, token) => {


    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(`${API_URL}/add-product`, formData, options)
    return response.data
}

const productUpdate = async (formData, token) => {

    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/product/${formData._id}`, formData, options)
    return response.data
}


const orderUpdate = async (token, orderDetails) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/order/${orderDetails.id}`, orderDetails, options)
    return response.data

}


const addCoupon = async (token, couponDetails) => {
    const options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.post(`${API_URL}/coupon`, couponDetails, options)
    return response.data
}



const shopService = { fetchShopDetails, fetchAllProducts, fetchAllOrders, fetchAllCoupons, createProduct, productUpdate, orderUpdate, addCoupon }


export default shopService