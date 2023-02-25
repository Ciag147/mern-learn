const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    url: {
        type: String
    },
    status: {
        type: String,
        enum: ['TO LEARN', 'LEARNING', 'LEARNED']
    },
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'users'
        // hai dòng trên để nối với collection bên users, các user có thể có kĩ năng cần học trùng nhau
    }
})

module.exports = mongoose.model('posts', PostSchema)