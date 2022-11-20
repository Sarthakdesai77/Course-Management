const express = require('express')
const router = express.Router()
const adminController = require('../controller/adminController')
const employeeController = require('../controller/employeeController')
const superAdminController = require('../controller/superAdminController')
const middle = require("../middleware/auth")

//----------------------------------------------------------------------------------------------------------------------//

router.post('/register', employeeController.userRegister)

router.post('/login', employeeController.userLogin)

router.get('/getCourse/employee/:id', middle.authentication, employeeController.getCourse)

router.post('/getCourse/employee/category/:id', middle.authentication, employeeController.getCourseByCategory)

router.post('/createCourse/:id', middle.authentication, middle.authorization, adminController.createCourse)

router.put('/updateCourse/:id/:courseId', middle.authentication, middle.authorization, adminController.updateCourse)

router.delete('/deleteCourse/:id/:courseId', middle.authentication, middle.authorization, adminController.deleteCourse)

router.get('/getCourse/:id', middle.authentication, superAdminController.getCourse);

router.put('/approveCourse/superAdmin/:id/:courseId', middle.authentication, middle.authorization, superAdminController.approveCourse);

// global route>>>>>>>>>>
router.all("*", function (req, res) {
    res.status(400).send({
        status: false,
        msg: "please enter valid api"
    })
})


module.exports = router