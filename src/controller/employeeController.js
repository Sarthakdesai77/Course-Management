const model = require('../models/userModels')
const courseModel = require('../models/courseModel')
const validator = require("../validator/validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const userRegister = async function (req, res) {
    try {
        let data = req.body
        let { name, email, password, role } = data

        //-----------------[Require field validation]
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

        //---------[Name validation]
        if (!name) return res.status(400).send({ status: false, message: 'Please enter name' })
        if (!validator.isValid(name)) return res.status(400).send({ status: false, message: 'Please enter first name in right format' })
        if (!validator.isValidName(name)) return res.status(400).send({ status: false, message: "Please enter first name in right format" })

        //----------[role validation]
        if (role) {
            let roles = ["employee", "admin", "superAdmin"];
            if (!roles.includes(role)) return res.status(400).send({ status: false, message: 'Please enter correct role' })
        }

        //----------[Email validation]
        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })

        //----------[Password Validation]
        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })
        if (!validator.isValidPassword(password)) return res.status(400).send({ status: false, message: 'Password should be between 8 to 15 character[At least One Upper letter, one small letter, one number and one special charater]' })

        //-----------[Password encryption]
        const bcryptPassword = await bcrypt.hash(password, 10)
        data.password = bcryptPassword

        //------------------[Unique field check DB calls]
        const emailUnique = await model.findOne({ email })
        if (emailUnique) return res.status(400).send({ status: false, message: 'Already register Email' })

        //------------[Document create]
        const user = await model.create(data)
        return res.status(201).send({ status: true, message: 'User Created Successfully', data: user })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const userLogin = async function (req, res) {
    try {
        let data = req.body;
        let { email, password } = data;

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

        //-----------------[email verification]
        if (!email) return res.status(400).send({ status: false, message: 'Please enter email' })
        if (!validator.isValidEmail(email)) return res.status(400).send({ status: false, message: 'Please enter valid email' })

        if (!password) return res.status(400).send({ status: false, message: 'Please enter password' })

        const Login = await model.findOne({ email })
        if (!Login) return res.status(400).send({ status: false, message: 'Not a register email Id' })

        //----------[Password Verification]
        let PassDecode = await bcrypt.compare(password, Login.password)
        if (!PassDecode) return res.status(401).send({ status: false, message: 'Password not match' })

        //----------[JWT token generate]
        let token = jwt.sign({
            userId: Login._id.toString()
        }, "SchbangQ", { expiresIn: '50d' })

        return res.status(200).send({ status: true, message: 'User login successfull', data: { userId: Login._id, token: token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getCourse = async (req, res) => {
    try {
        let id = req.params.id;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'employee' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[find course]
        let course = await courseModel.find({ approve: true, isDeleted: false }).sort({ category: 1 })
        if (course.length == 0) return res.status(404).send({ status: false, message: 'course not found' })

        res.status(200).send({ status: true, message: 'courses', data: course })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const getCourseByCategory = async (req, res) => {
    try {
        let id = req.params.id;
        let category = req.body.category;

        if (!category) return res.status(400).send({ status: false, message: 'category is required' });

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'employee' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[find course]
        let course = await courseModel.find({ approve: true, isDeleted: false, category: category })
        if (course.length == 0) return res.status(404).send({ status: false, message: 'course not found' })

        res.status(200).send({ status: true, message: 'courses', category: category, data: course })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { userRegister, userLogin, getCourse, getCourseByCategory }