const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

const Post = require('../models/Post'); //load thằng model post ra

//@route GET api/posts
//@desc Get post
//@access Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ user: req.userId }).populate('user', ['username'])
        //populate để chui vào trường user và lấy ra username
        res.json({success: true, posts})
    } catch (error) {
        console.log(error)
        return res.status(500).json({success: false, message: 'Internal server error'})
    }
})


//@route POST api/posts
//@desc Create post
//@access Private
router.post('/', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body

    //simple validation
    if(!title)
    return res.status(400).json({success: false, message: 'Title is required!'})

    try {
        //ok hết rồi thì bắt đầu tạo cái post mới
        const newPost = new Post({
            title, 
            description, 
            url: (url.startsWith('https://')) ? url :`https://${url}`, 
            status: status || 'TO LEARN',
            user: req.userId
        })

        await newPost.save()

        res.json({success: true, message: 'Happy learning', post: newPost})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }
})


//@route PUT api/posts
//@desc Update post
//@access Private
router.put('/:id', verifyToken, async (req, res) => {
    const {title, description, url, status} = req.body

    //simple validation
    if(!title)
    return res.status(400).json({success: false, message: 'Title is required!'})

    try {
        //ok hết rồi thì bắt đầu sửa cái post
        let updatedPost = {
            title,
            description: description || '',
            url: ((url.startsWith('https://')) ? url :`https://${url}`) || '',
            status: status || 'TO LEARN'
        }

        const popstUpdateCondition = {_id: req.params.id, user: req.userId}

        updatedPost = await Post.findOneAndUpdate(popstUpdateCondition, updatedPost, {new: true})
        //new: true dùng để nếu có sửa thì đưa bản đã sửa vào DB, không thì giữ nguyên bản cũ

        //User not authorised to update post or post not found
        if(!updatedPost)
        return res.status(401).json({success: false, message: 'Post not found or user not authorised!'})

        res.json({success: true, message: 'Excellent progress', post: updatedPost})

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error'})
    }

})


//@route DELETE api/posts
//@desc Delete post
//@access Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const postDeleteCondition = {_id: req.params.id, user: req.userId};
        const deletedPost = await Post.findOneAndDelete(postDeleteCondition)

        //User not authorised to update post or post not found
        if(!deletedPost)
        return res.status(401).json({success: false, message: 'Post not found or user not authorised!'})

        res.json({success: true, post: deletedPost}) 

    } catch (error) {
        console.log(error)
        res.status(500).json({success: false, message: 'Internal server error!'})
    }
})


module.exports = router