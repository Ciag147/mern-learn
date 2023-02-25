const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]
    //jwt tạo ra token có dạng "Bearer addnjnsmkndknf" nên là split ra
    //để lấy cái phần tử sau thằng Bearer(số 1 là phần tử thứ 2 trong mảng) 

    if (!token)
    return res.status(401).json({ success: false, message: 'Access token not found!' })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        req.userId = decoded.userId
        next() // Kiểm tra xong thì cho qua

    } catch (error) {
        console.log(error)
        return res.status(403).json({ success: false, message: 'Invalid token!' })
    }
}

module.exports = verifyToken