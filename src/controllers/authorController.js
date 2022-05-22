const AuthorModel = require("../models/authorModel")

// Problem 1

const AuthorCreate = async function (req, res) {
    try {
        let body = req.body
        if (Object.keys(body).length === 0 && Object.values(body).length === 0) {
            return res.status(404).send({ Status: false, msg: "No data Found to create the account" })
        }

        if (!body.fname) {
            return res.status(400).send({ status: false, msg: "First name is required" })
        }
        if (!body.lname) {
            return res.status(400).send({ status: false, msg: "Last name is required" })
        }
        if (!body.title) {
            return res.status(400).send({ status: false, msg: "Title is required" })
        }
        if (!body.email) {
            return res.status(400).send({ status: false, msg: " No Email found,   Email id is required" })
        }
        if (!body.password) {
            return res.status(400).send({ status: false, msg: "Password is required" })
        }

        // Regex in Validation
        // regex

        let StringCheckWihoutSpace = /^[A-Za-z]{1,}$/
        let StringAllowwithSpace = /^[A-Z a-z]{1,}$/
        let emailCheck = /^[A-Za-z_.0-9]{2,}@[A-Za-z]{2,12}[.]{1}[A-Za-z.]{2,5}$/

        if (!StringAllowwithSpace.test(body.fname)) {
            return res.status(400).send({ Status: false, msg: " fname: No Special Character allowed" })
        }
        if (!StringCheckWihoutSpace.test(body.lname)) {
            return res.status(400).send({ Status: false, msg: " lname: No Special Character or Space allowed" })
        }
        if (!StringCheckWihoutSpace.test(body.title)) {
            return res.status(400).send({ Status: false, msg: " title : No Special Character or Space allowed, use only any one from this - Mr/Mrs/Miss" })
        }
        if (!emailCheck.test(body.email)) {
            return res.status(400).send({ Status: false, msg: "Please put a valid email, do not use @99acre.com only @gmail/yahoo/hotmail etc "})
        }

        let checkEmail = await AuthorModel.findOne({ email: body.email })
        if (checkEmail) {
            if (checkEmail.email === body.email) {
                return res.status(400).send({ Status: false, msg: " This email has been used already, please use another email" })
            }
        }

        if (body.title === "Mr" || body.title === "Miss" || body.title === "Mrs") {

            let author = await AuthorModel.create(body);
            return res.status(201).send({Status: true, data: author });
        }
        else {
            return res.status(400).send({ Status: false, msg: " title: Please put a valid title" })
        }
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.AuthorCreate = AuthorCreate