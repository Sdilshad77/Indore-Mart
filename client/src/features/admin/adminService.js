import API from "../../api/axios";

const fetchAllUsers = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get(`/api/admin/users`, options)
    return response.data
}

const fetchAllOrders = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get(`/api/admin/orders`, options)
    return response.data
}

const fetchAllshops = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get(`/api/admin/shops`, options)
    return response.data
}

const updateUser = async (userDetails, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put(`/api/admin/users/${userDetails.userId}`, userDetails, options)
    return response.data
}

const updateShop = async (shopDetails, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put(`/api/admin/shops/${shopDetails.shopId}`, shopDetails, options)
    return response.data
}

const updateOrder = async (orderDetails, token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put(`/api/admin/orders/${orderDetails.orderId}`, { status: orderDetails.status }, options)
    return response.data
}

const adminService = { fetchAllUsers, fetchAllOrders, fetchAllshops, updateShop, updateUser, updateOrder }

export default adminService