import Product from "../models/productModel.js"

const getProducts = async (req, res) => {
    const products = await Product.find().populate('shop')

    if (!products) {
        res.status(404)
        throw new Error('Products Not Found!')
    }

    res.status(200).json(products)

}

const getProduct = async (req, res) => {
    const product = await Product.findById(req.params.pid).populate("shop")

    if (!product) {
        res.status(404)
        throw new Error('Product Not Found!')
    }

    res.status(200).json(product)
}


const searchProduct = async (req, res) => {
    res.send("Cheese Here")
}

const productController = { getProduct, getProducts, searchProduct }


export default productController