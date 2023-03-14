const express = require('express');
const router = express.Router();
const Blog = require('../schema/BlogSchema');
const Comment = require('../schema/CommentSchema')

const threeDayFilter = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
router.get('/', async (req, res) => {
    try {
      const getBlogs = await Blog.find({
        $or: [
          { postedBy: "anonymous", createdAt: { $gt: threeDayFilter } },
          { postedBy: { $ne: "anonymous" } }
        ]
      }).sort({ createdAt: -1 });
      return res.status(200).send(getBlogs);
    } catch (error) {
      console.error(error);
      return res.sendStatus(500);
    }
})
  

router.get('/:blogId', async (req, res) => {
    const {blogId} = req.params;
    try {
        const getBlogs = await Blog.findById(blogId);
        return res.status(200).send(getBlogs);
    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.get('/:blogId/comments', async (req, res) => {
    const {blogId} = req.params;
    try {
        const getComments = await Comment.find({ commentOn: blogId }).sort({ createdAt: -1 });
        return res.status(200).send(getComments);
    } catch(error) {
        console.error(error);
        return res.sendStatus(500);
    }
})

router.post('/', async (req, res) => {
    const { content, postedBy, title } = req.body;

    if (!content.trim() || !postedBy || !title.trim()) {
        return res.sendStatus(400);
    }

    if (content.length > 1000 || postedBy.length > 25 || title.length > 50) {
        return res.sendStatus(400);
    }

    try {
        const newBlog = await Blog.create(req.body);
        res.status(201).send(newBlog);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

router.post('/:blogId', async (req, res) => {
    const { content, postedBy } = req.body;

    if (!content.trim() || !postedBy) {
        return res.sendStatus(400);
    }

    if (content.length > 1000 || postedBy.length > 50) {
        return res.sendStatus(400);
    }

    try {
        const newComment = await Comment.create(req.body);
        res.status(201).send(newComment);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})

module.exports = router;