import API from "../../api/axios";

const fetchProducts = async () => {
    const response = await API.get("/api/products")
    return response.data
}

const fetchProduct = async (pid) => {
    const response = await API.get("/api/products/" + pid)
    return response.data
}

const fetchShops = async () => {
    const response = await API.get("/api/shops")
    return response.data
}

const fetchShop = async (id) => {
    const response = await API.get("/api/shops/" + id)
    return response.data
}

const productService = { fetchProducts, fetchProduct, fetchShops, fetchShop }

export default productService