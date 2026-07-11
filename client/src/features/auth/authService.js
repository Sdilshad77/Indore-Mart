import API from "../../api/axios";

const register = async (formData) => {
    const response = await API.post("/api/auth/register", formData)
    localStorage.setItem("user", JSON.stringify(response.data))
    return response.data
}

const login = async (formData) => {
    const response = await API.post("/api/auth/login", formData)
    localStorage.setItem("user", JSON.stringify(response.data))
    return response.data
}

const fetchMyOrders = async (token) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.get("/api/orders", options)
    return response.data
}

const orderCancel = async (token, orderDetails) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.put("/api/orders/" + orderDetails.id, { status: "cancelled" }, options)
    return response.data
}

const requestShopApproval = async (token, shopDetails) => {
    let options = {
        headers: {
            authorization: `Bearer ${token}`
        }
    }
    const response = await API.post("/api/shop-owner/create-shop", shopDetails, options)
    return response.data
}

const authService = { register, login, fetchMyOrders, orderCancel, requestShopApproval }

export default authService