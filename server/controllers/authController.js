import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import User from "../models/userModel.js"

const registerUser = async (req, res) => {

    // Check if all fields are coming
    const { name, email, phone, password, address } = req.body

    if (!name || !email || !phone || !password || !address) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    // Check If User Already Exists
    const emailExist = await User.findOne({ email })
    const phoneExist = await User.findOne({ phone })

    if (emailExist || phoneExist) {
        res.status(409)
        throw new Error("User Already Exists")
    }

    // Validate Phone Number
    if (phone.length !== 10) {
        res.status(409)
        throw new Error("Please Enter Valid Phone Number")
    }


    // Hash Password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    // Create User
    const user = await User.create({
        name, email, password: hashedPassword, phone, address
    })

    if (!user) {
        res.status(409)
        throw new Error("User Not Created!")
    }

    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        isAdmin: user.isAdmin,
        isShopOwner: user.isShopOwner,
        isActive: user.isActive,
        token: generateToken(user._id)
    })

}

const loginUser = async (req, res) => {
    // Check if all fields are coming
    const { email, password } = req.body

    if (!email || !password) {
        res.status(409)
        throw new Error('Please Fill All Details!')
    }

    // Find User
    const user = await User.findOne({ email })

    // Check Password

    if (user && await bcrypt.compare(password, user.password)) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            isAdmin: user.isAdmin,
            isShopOwner: user.isShopOwner,
            isActive: user.isActive,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error("Invalid Credentials")
    }



}

// Private Controller
const privateAccess = (req, res) => {
    res.json({
        msg: `Request is made by : ${req?.user.name}`
    })
}



// Generate Token
const generateToken = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    return token
}




const authControllers = {
    registerUser,
    loginUser,
    privateAccess
}

export default authControllers
