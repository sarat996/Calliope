const Blog = require('../models/blog');


// get all blogs by user /blogs

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ user: req.user.id });
        res.json(blogs);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
}
//get specific blog
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id, user: req.user.id });

        if (!blog) return res.status(404).json([
            {
                message: 'Blog not found',
                type: 'error'
            }
        ])
        res.json(blog);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
}

//create a new blog
const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const newBlog = new Blog({
            title,
            content,
            user: req.user.id
        });

        await newBlog.save();

        if (!newBlog) return res.status(400).json([{ message: 'Blog not created', type: 'error' }]);

        res.json(newBlog);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
}

//update existing blog
const updateBlog = async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = await Blog.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { title, content }, { new: true });
        res.json(blog);
    } catch (err) {
        console.error(`ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
}

//delete an existing blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        res.json({
            blogId: req.params.id,
            toasts: [{ message: 'Blog deleted', type: 'success' }]
        });
    } catch (error) {
        console.error(`ERROR: ${err.message}`);
        res.status(500).send('Server Error');
    }
}

module.exports = {
    deleteBlog,
    updateBlog,
    createBlog,
    getBlogs,
    getBlogById
}