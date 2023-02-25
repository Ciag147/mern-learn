require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

const connectDB = async () => {
    try {
    await mongoose.connect(`mongodb://localhost:27017/mern-learnit`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    console.log('MongoDB connected');

    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}
mongoose.set('strictQuery', true);// Dòng này để không báo lỗi vặt do xài mongoose 7

connectDB();

const app = express();

app.use(express.json());//để nó đọc được dữ liệu username, password -
// - hoặc bất cứ dữ liệu nào gửi trong body với header là application/json

app.use(cors())

//Đưa đường link có dạng dưới tới route auth
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
