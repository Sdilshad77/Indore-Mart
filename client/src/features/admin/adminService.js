import axios from "../../api/axios";

// const API_URL = "https://indore-mart.onrender.com/api/admin";

const API_URL = "http://localhost:8080/api/admin";


const fetchAllUsers = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/users`, options)
    return response.data
}

const fetchAllOrders = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/orders`, options)
    return response.data
}

const fetchAllshops = async (token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.get(`${API_URL}/shops`, options)
    return response.data
}


const updateUser = async (userDetails, token) => {


    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/users/${userDetails.userId}`, userDetails, options)
    return response.data

}

const updateShop = async (shopDetails, token) => {

    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }

    const response = await axios.put(`${API_URL}/shops/${shopDetails.shopId}`, shopDetails, options)
    return response.data

}

const updateOrder = async (orderDetails, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await axios.put(`${API_URL}/orders/${orderDetails.orderId}`, { status: orderDetails.status }, options)
    return response.data
}



const adminService = { fetchAllUsers, fetchAllOrders, fetchAllshops, updateShop, updateUser, updateOrder }

export default adminService