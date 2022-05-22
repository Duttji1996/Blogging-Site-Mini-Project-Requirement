const AuthorModel = require('../models/authorModel')
const BloggerModel = require('../models/blogModel')
const jwt = require('jsonwebtoken')



// Phase 2nd Problem 1

const login = async function (req, res) {
    try {
        let body = req.body

        let emailCheck= /^[A-Za-z_.0-9]{2,}@[A-Za-z]{2,12}[.]{1}[A-Za-z.]{2,5}$/

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ Status: false, msg: "No data Found into body" })
        }

        if (!body.password) {
            return res.status(400).send({ Status: false, msg: "You have not entered the password " })
        }
        if (!body.email) {
            return res.status(400).send({ Status: false, msg: "You have not entered the email id" })
        }
        // regex in validation of Email

        if(!emailCheck.test(body.email)){
            return res.status(400).send({Status: false, msg:" email: Please put a valid email"})
        }

        let authorization = await AuthorModel.findOne({ email: body.email, password: body.password })

        if (!authorization) {
            return res.status(400).send({ Satus: false, msg: "No email id or password found" })
        }

        let author_token = jwt.sign({

            author_id: authorization._id,
            

        }, "Functionup-Team52")

        res.setHeader("x-api-key", author_token)    /// i have to ask this one
       return res.status(201).send({ Status: true, data: author_token })

    }
    catch (err) {
        return res.status(500).send({Satus:false, msg: "Error", error: err.message })
    }

}

// Phase 2 Problem 2

const authentication = async function (req, res, next) {
    try {

        let header = req.headers
        let author_token = header['x-api-key'] || header["X-API-KEY"]
        if (!author_token) {
            return res.status(400).send({ Status: false, msg: "Token is not present" })
        }

        try {
            let DecodeToken = jwt.verify(author_token, "Functionup-Team52")
            
            if(DecodeToken){
                req.AuthorId=DecodeToken.author_id
                next()
            }
            else{
                return res.status(400).send({ Status: false, msg: "Token could not verify" })
            }
         
        }
        catch (err) {
            return res.status(400).send({ Status: false, msg: "you have entered a wrong token" })
        }
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}
//=======================================================================================================================//

const authorization = async function (req, res, next) {
    try {
        let blogId=req.params.blogId
        let AuthorToken=req.AuthorId

        if(!blogId){
            return res.status(400).send({ Status: false, msg: "Please enter a blog Id into params" })
        }
        if(blogId.length !=24){
            return res.status(400).send({ Status: false, msg: "Please enter 24 digit's lenght of blog Id into params" })
        }

        let bloggerVerification = await BloggerModel.findById(blogId)

        if (!bloggerVerification) {
            return res.status(400).send({ Status: false, msg: "Error: Blog id does not exist" })
        }

        let AuthorDetail = await AuthorModel.findById(bloggerVerification.authorId)

        if (AuthorDetail) {
            if(AuthorToken != AuthorDetail._id){
                return res.status(400).send({ Status: false, msg: "You are not authorise person, please use exact token" })
            }
            else{
                next()
            }
        }
        else{
            return res.status(400).send({ Status: false, msg: "Author Id not found with given blog" })  
        }
    }
    catch (err) {
        return res.status(500).send({ Status: false, msg: err.message })
    }
}
// ================================================================================================================================//



module.exports={login,authentication,authorization}