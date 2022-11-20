const jwt = require("jsonwebtoken");
const userModel = require('../models/userModels')
const validator = require("../validator/validator")

const authentication = async function (req, res, next) {
    try {
        let token = req.headers.authorization

        if (!token) return res.status(400).send({ status: false, message: "token must be present" });

        token = token.split(" ")[1];

        jwt.verify(token, "SchbangQ", function (err, decoded) {
            if (err) {
                return res.status(401).send({ status: false, message: err.message })

            } else {
                req.decodedToken = decoded
                next()
            }
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        const userId = req.params.id
        
        //-----------------[id validation]
        if (!validator.isValidObjectId(userId)) return res.status(400).send({ status: false, message: "Please enter valid Id" })

        let tokenUserId = req.decodedToken.userId

        let checkUserId = await userModel.findById(userId)
        if (!checkUserId) return res.status(404).send({ status: false, message: 'No such user' })

        if (userId != tokenUserId) {
            return res.status(403).send({ status: false, message: "UnAuthorized Access!!" })
        }
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { authentication, authorization }