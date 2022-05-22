const express = require('express');
const router = express.Router();
const AuthorController=require("../controllers/authorController")
const BloggerController=require("../controllers/blogController")
const Auth = require('../controllers/AllMiddleware')

router.post("/authors",AuthorController.AuthorCreate)    // For author creation

router.post("/blogs",Auth.authentication,BloggerController.BloggerCreate)   // for blog creation

router.get("/blogs",Auth.authentication,BloggerController.GetData)              // for getting a blogs

router.put("/blogs/:blogId",Auth.authentication,Auth.authorization,BloggerController.UpdateData)

router.delete("/blogs/:blogId",Auth.authentication,Auth.authorization,BloggerController.delData)

router.delete("/blogs",Auth.authentication,BloggerController.deleted)          

router.post('/login', Auth.login);

module.exports = router;