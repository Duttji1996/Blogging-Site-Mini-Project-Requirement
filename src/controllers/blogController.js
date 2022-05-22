const BloggerModel = require("../models/blogModel")
const AuthorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const authorModel = require("../models/authorModel")


// Problem 2

const BloggerCreate = async function (req, res) {

    try {
        let body = req.body

        let StringCheckWithSpace = /^[A-Za-z ]{1,}$/
        let StringAllowwithSpace = /^[A-Za-z ,-]{1,}$/

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, msg: "Sorry You have not entered any data into body" })
        }
        if (!body.authorId) {
            return res.status(400).send({ Status: false, msg: "Sorry please enter the author id" })
        }

        let AuthorIdLength = body.authorId

        if (AuthorIdLength.length != 24) {
            return res.status(400).send({ Status: false, msg: "Sorry please enter the 24 digit of author id" })
        }
        let AuthorDetail = await AuthorModel.findById({ _id: body.authorId })

        if (!AuthorDetail) {
            return res.status(400).send({ Satus: false, msg: "Author Id is not found" })
        }
        const tokenDecode = req.AuthorId                     // gettimg data from req in a middleware
        if (tokenDecode != AuthorDetail._id) {
            return res.status(404).send({ msg: "Error", Status: " You are not authorise, please use exact token" })
        }
        if (!body.title) {
            return res.status(404).send({ msg: "Error", Status: " Please enter the title" })
        }
        if (!body.body) {
            return res.status(404).send({ msg: "Error", Status: " Please enter the body" })
        }
        if (!body.category) {
            return res.status(404).send({ msg: "Error", Status: " Please enter the category" })
        }

        // regex use

        if (!StringAllowwithSpace.test(body.title)) {
            return res.status(403).send({ Status: false, msg: " title: Special Characters or Space or comma (,)  are not allowed" })
        }
        if (!StringCheckWithSpace.test(body.body)) {
            return res.status(403).send({ Status: false, msg: " body: No Special Characters or space are allowed" })
        }
        if (!StringAllowwithSpace.test(body.category)) {
            return res.status(403).send({ Status: false, msg: " category: No Special Characters are allowed" })
        }

        let createBlogg = await BloggerModel.create(body)

        if (body.isPublished === true) {
            let Update = await BloggerModel.updateMany({ authorId: body.authorId }, { $set: { publishedAt: new Date() } }, { new: true })
        }
        if (body.isDeleted === true) {
            let CreateDeleteTime = await BloggerModel.updateMany({ authorId: body.authorId }, { $set: { deletedAt: new Date() } }, { new: true })
        }

        let Finaldata = await BloggerModel.find(body)
        return res.status(201).send({ Status: true, data: Finaldata })
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: err.message })
    }
}

// Problem 3rd

const GetData = async function (req, res) {
    try {
        let query = req.query
        if (query.authorId) {
            let checkAuthor = await authorModel.findById({ _id: query.authorId })
            if (!checkAuthor) {
                return res.status(400).send({ Satus: false, msg: "Author Id is not found" })
            }
        }
        //----------- if query have four combination ---------------------------------------------------------------//
        if (query.authorId || query.tags || query.subcategory || query.category) {

            let Blogcheck = await blogModel.find({ $and: [req.query, { isDeleted: false, isPublished: true }] })
            if (Blogcheck.length === 0) {
                return res.status(400).send({ Satus: false, msg: "Blog not found" })
            }
            return res.status(200).send({ Status: true, data: Blogcheck })
        }
        // ----------------if there is no query ---------------------------------------------------------------------//

        let Blogcheck = await blogModel.find({ isDeleted: false, isPublished: true })
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

        let DataUpdate = await BloggerModel.findById(params.blogId)

        if (DataUpdate.isDeleted === true) {
            return res.status(400).send({ Status: false, msg: "We cant Published a deleted blog" })
        }
        if (DataUpdate.isPublished === true) {
            return res.status(400).send({ Status: false, msg: "this is already Published" })
        }

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, msg: "No data found to update" })
        }

        let UpData = await BloggerModel.findByIdAndUpdate({ _id: params.blogId }, { title: body.title, body: body.body, isPublished: true, publishedAt: new Date(), $push: { tags: body.tags, subcategory: body.subcategory } }, { new: true })

        if (!UpData) {
            return res.status(404).send({ Status: false, msg: "No blog found" })
        }

        return res.status(201).send({ Status: true, data: UpData })
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
        let checkAuthor = await authorModel.findById({_id:req.query.authorId})
        if(!checkAuthor){
            return res.status(400).send({ Status: false, msg: "No Author found with given AuthorId" })  
        }
        else{
             // gettimg data from req by a middleware1
            if(checkAuthor._id != req.AuthorId){
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