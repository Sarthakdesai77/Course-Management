const model = require('../models/userModels')
const courseModel = require('../models/courseModel')

const getCourse = async (req, res) => {
    try {
        let id = req.params.id;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'superAdmin' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[find course]
        let course = await courseModel.find({ approve: false, isDeleted: false })
        if (course.length == 0) return res.status(404).send({ status: false, message: 'course not found' })

        res.status(200).send({ status: true, message: 'courses', data: course });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const approveCourse = async (req, res) => {
    try {
        let id = req.params.id;
        let courseId = req.params.courseId;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'superAdmin' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[find course]
        let course = await courseModel.findOneAndUpdate({ _id: courseId, isDeleted: false, approve: false }, { approve: true }, { new: true });
        if (!course) return res.status(404).send({ status: false, message: 'course not found' });

        res.status(200).send({ status: true, message: 'approved successfully', data: course });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { approveCourse, getCourse }