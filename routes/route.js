const express = require('express');
const router = express.Router();

const middlewares = require('../middelware/auth.js');

const authorController = require('../controllers/authorController.js');
const blogController = require('../controllers/blogController.js');
const loginController = require('../controllers/loginController.js');


router.post('/authors', authorController.createAuthor); 
router.post('/login', loginController.login);
router.post('/blogs', middlewares.authentication, blogController.createBlog); 
router.get('/blogs',  blogController.getBlog); 
router.put('/blogs/:blogId', middlewares.authentication, blogController.updateBlog); 
router.delete('/blogs/:blogId', middlewares.authentication, blogController.deleteBlogById); 
router.delete('/blogs', middlewares.authentication, blogController.deleteBlogByQuery); 
//router.post('/createBlog', middlewares.authentication, blogController.createBlog); 

module.exports = router;  