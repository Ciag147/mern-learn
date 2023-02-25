//File xác thực người dùng, login, logout, register
const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/auth');

//Load model User
const User = require('../models/User');

//@route GET api/auth
//@desc Check if user is logged in
//@access Public
router.get('/', verifyToken, async (req,res) => {
    try {
        const user = await User.findById(req.userId).select('-password')
        if(!user) return res.status(400).json({success: false, message: 'User not found!'})
        res.json({success: true, user})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error!'})
    }
})


//@route POST api/auth/register
//@desc Register user
//@access Public
router.post('/register', async (req, res) => {
    const {username, password} = req.body

    //simple validation
    if(!username || !password)
    return res.status(400).json({success: false, message: 'Missing username and/or password!'});

    try {
        //Check for existing user
        const user = await User.findOne({ username })
        if(user)
        return res.status(400).json({success: false, message: "Username already taken!"})

        //All good case
        //Hash password (hash cũng là async nên phải await)
        const hashedPassword = await argon2.hash(password)
        const newUser = new User({username, password: hashedPassword}) // = username: username
        await newUser.save()

        //Return token (gần giống mã OTP, cái này đang dùng jsonwebtoken)
        const accessToken = jwt.sign(
            { userId: newUser._id }, 
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({success: true, message: "User created successfully", accessToken})
    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})

//@route POST api/auth/login
//@desc Login user
//@access Public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    //simple validation
    if(!username || !password)
    return res.status(400).json({success: false, message: 'Missing username and/or password!'});

    try {
        //Check username
        const user = await User.findOne({username})
        if (!user)
        return res.status(400).json({success: false, message: 'Incorrect username or password!'})
        
        //Username found
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid)
        return res.status(400).json({success: false, message: 'Incorrect username or password!'})

        //All good case(thế thì trả lại token rồi cho nó đăng nhập vào thôi)
        //Return token (gần giống mã OTP, cái này đang dùng jsonwebtoken)
        const accessToken = jwt.sign(
            { userId: user._id }, 
            process.env.ACCESS_TOKEN_SECRET
        )

        res.json({success: true, message: "Logged in successfully", accessToken})


    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})


module.exports = router;