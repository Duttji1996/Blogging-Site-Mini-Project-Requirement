const BloggerModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")

//------------------Validatio for Object Id ---------------------------------------------//

const mongoose = require('mongoose')

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

//---------------------------regex ------------------------------------------------------//

let StringCheckWithSpace = /^[A-Za-z ]{1,}$/
let StringAllowwithSpace = /^[A-Za-z ,-]{1,}$/


//-------------------------------------------------------------------------------------//


// Problem 2

const BloggerCreate = async function (req, res) {

    try {
        let body = req.body

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, msg: "Sorry You have not entered any data into body" })
        }

        if (!body.authorId) {
            return res.status(400).send({ Status: false, msg: "Sorry please enter the author id" })
        }
        if (!isValidObjectId(body.authorId)) {
            return res.status(400).send({ Status: false, msg: "please enter the valid author id" })
        }

        let AuthorDetail = await AuthorModel.findById({ _id: body.authorId })

        if (!AuthorDetail) {
            return res.status(400).send({ Satus: false, msg: "Author Id is not found" })
        }
   
        //-----------------------checking authorizaton ---------------------------------------------------//
        let tokenDecode = req.AuthorId                     // gettimg data from req in a middleware

        if (tokenDecode != AuthorDetail._id) {
            return res.status(401).send({ msg: "Error", Status: "unauthorised access" })
        }

        //---------------------------Checking Title, Body, Category  if not coming -------------------//
        if (!body.title) {
            return res.status(400).send({ msg: "Error", Status: " Please enter the title" })
        }
        if (!body.body) {
            return res.status(400).send({ msg: "Error", Status: " Please enter the body" })
        }
        if (!body.category) {
            return res.status(400).send({ msg: "Error", Status: " Please enter the category" })
        }

        //-------------------------validating with regex --------------------------------------------//

        if (!StringAllowwithSpace.test(body.title)) {
            return res.status(400).send({ Status: false, msg: " title: Special Characters or Space or comma (,)  are not allowed" })
        }
        if (!StringCheckWithSpace.test(body.body)) {
            return res.status(400).send({ Status: false, msg: " body: No Special Characters or space are allowed" })
        }
        if (!StringAllowwithSpace.test(body.category)) {
            return res.status(400).send({ Status: false, msg: " category: No Special Characters are allowed" })
        }

        //-----------------assuming if subcategory is coming --------------------------------------------//
        if (body.subcategory) {
            if (!StringAllowwithSpace.test(body.subcategory)) {
                return res.status(400).send({ Status: false, msg: " category: No Special Characters are allowed" })
            }
        }

        //------------------------------------Assuming if isPublished/isDeleted is coming-------------------------//

        if(body.isPublished){
            if(typeof body.isPublished === "string"){
                return res.status(400).send({ Status: false, msg: " isPublished: please do not use string , please enter true/false" })
            }
            if(body.isPublished === true){
                body.publishedAt = new Date()
            }
        }

        if(body.isDeleted){
            if(typeof body.isDeleted === "string"){
                return res.status(400).send({ Status: false, msg: " isDeleted: please do not use string , please enter true/false" })
            }
            if(body.isDeleted === true){
                body.deletedAt = new Date()
            }
        }

        //----------------------------------Creating a blog ----------------------------------------------//

        let createBlogg = await BloggerModel.create(body)

        return res.status(201).send({ Status: true, data: createBlogg })
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: err.message })
    }
}

// Problem 3rd

const GetData = async function (req, res) {
    try {
        let query = req.query

        let filterdata = { isDeleted: false,isPublished: true }

        //------------------if author id is coming -------------------------------------//
        if (query.authorId) {

            if (!isValidObjectId(query.authorId)) {
                return res.status(400).send({ Status: false, msg: "please enter the valid author id" })
            }
            let checkAuthor = await authorModel.findById({ _id: query.authorId })
            if (!checkAuthor) {
                return res.status(400).send({ Satus: false, msg: "Author Id is not found" })
            }
            filterdata.authorId = query.authorId
        }

        //--------------------------if tags is coming -------------------------------------------//

        if (query.tags) {
            if (!StringAllowwithSpace.test(query.tags)) {
                return res.status(400).send({ Status: false, msg: " tags: No Special Characters are allowed" })
            }
            filterdata.tags = query.tags

        }

        //----------------------if category is coming ----------------------------------------//
        if (query.category) {
            if (!StringAllowwithSpace.test(query.category)) {
                return res.status(400).send({ Status: false, msg: " category: No Special Characters are allowed" })
            }

            filterdata.categeory = query.categeory
        }

        //--------------------------if subcategory is coming ----------------------------------------//
        if (query.subcategory) {
            if (!StringAllowwithSpace.test(query.subcategory)) {
                return res.status(400).send({ Status: false, msg: " subcategory: No Special Characters are allowed" })
            }

            filterdata.subcategory = query.subcategory
        }

        // console.log("filter data:     ",filterdata)

        //----------- if query have four combination ---------------------------------------------------------------//
       

            let Blogcheck = await blogModel.find(filterdata)
            if (Blogcheck.length === 0) {
                return res.status(400).send({ Satus: false, msg: "Blog not found" })
            }
            return res.status(200).send({ Status: true, data: Blogcheck })
        
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: "Error", error: err.message })
    }
}

// Problem 4

const UpdateData = async function (req, res) {
    try {
        let body = req.body

        let params = req.params

        if (!isValidObjectId(params.blogId)) {
            return res.status(400).send({ Status: false, msg: "please enter the valid blogId" })
        }

        let DataUpdate = await BloggerModel.findById(params.blogId)

        if (DataUpdate.isDeleted === true) {
            return res.status(400).send({ Status: false, msg: "This blog has been delete" })
        }
        if (DataUpdate.isPublished === true) {
            return res.status(400).send({ Status: false, msg: "this is already Published" })
        }

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, msg: "No data found to update" })
        }

        //---------------if title is coming for update ---------------------------------//

        if(body.title){
            if (!StringAllowwithSpace.test(body.title)) {
                return res.status(400).send({ Status: false, msg: " title: Special Characters or Space or comma (,)  are not allowed" })
            }
        }

        //---------------------if body is coming update -----------------------------//

       if(body.body){
        if (!StringCheckWithSpace.test(body.body)) {
            return res.status(400).send({ Status: false, msg: " body: No Special Characters or space are allowed" })
        }
       }
       //-----------------------if subcategory is coming to update -------------------------//
        if (body.subcategory) {
            if (!StringAllowwithSpace.test(body.subcategory)) {
                return res.status(400).send({ Status: false, msg: " subcategory: No Special Characters are allowed" })
            }
        }

        //---------------------if tags is coming to add -----------------------------------//

        if(body.tags){
            if (!StringAllowwithSpace.test(body.tags)) {
                return res.status(400).send({ Status: false, msg: " tags: No Special Characters are allowed" })
            }
        }

        //----------------------------Final Answer ----------------------------------//

        let UpData = await BloggerModel.findByIdAndUpdate({ _id: params.blogId }, { title: body.title, body: body.body, isPublished: true, publishedAt: new Date(), $push: { tags: body.tags, subcategory: body.subcategory } }, { new: true })

        if (!UpData) {
            return res.status(404).send({ Status: false, msg: "No blog found" })
        }

        return res.status(200).send({ Status: true, data: UpData })
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: "Error", error: err.message })
    }
}

// Problem 5

const delData = async function (req, res) {
    try {
        let id = req.params.blogId

        let verification = await BloggerModel.findById(id)

        if (verification.isDeleted === true) {
            return res.status(400).send({ Status: false, msg: " already deleted" })
        }
        else {
            let FinalResult = await BloggerModel.findByIdAndUpdate(id, { isDeleted: true, deletedAt: new Date() }, { new: true })
            return res.status(201).send({ Status: true, data: " Successfully deleted the blog ", data: FinalResult })
        }
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: "Error", error: err.message })
    }
}

// Problem 6

const deleted = async function (req, res) {
    try {
        let query = req.query
        // Validation Part 
        if (!query.authorId) {
            return res.status(400).send({ Status: false, msg: "You have not entered the Author id in query params" })
        }
        let checkAuthor = await authorModel.findById({ _id: req.query.authorId })
        if (!checkAuthor) {
            return res.status(400).send({ Status: false, msg: "No Author found with given AuthorId" })
        }
        else {
            // gettimg data from req by a middleware1
            if (checkAuthor._id != req.AuthorId) {
                return res.status(404).send({ msg: "Error", Status: " You are not authorise, please use exact token" })
            }
        }
        if (!query.category) {
            return res.status(400).send({ Status: false, msg: "You have not entered the category in query params" })
        }
        if (!query.subcategory) {
            return res.status(400).send({ Status: false, msg: "You have not entered the subcategory in query params" })
        }

        if (!query.tags) {
            return res.status(400).send({ Status: false, msg: "You have not entered the tags in query params" })
        }

        if (query.isPublished === "true") {
            return res.status(400).send({ Status: false, msg: "Sorry you are not allowed to delete this blog " })
        }


        let delDeatails = await BloggerModel.findOneAndUpdate({ $and: [{ categeory: query.categeory }, { authorId: query.authorId }, { tags: query.tags }, { subcategory: query.subcategory }, { isPublished: false }] }, { isDeleted: true, deletedAt: new Date() }, { new: true })

        if (!delDeatails) {
            return res.status(404).send({ Status: false, msg: " Data doesn't exist" })
        }
        res.status(200).send({ Status: true, data: delDeatails })
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: "server error", error: err.message })
    }

}


module.exports = { BloggerCreate, GetData, UpdateData, delData, deleted }