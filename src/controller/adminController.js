const model = require('../models/userModels')
const courseModel = require('../models/courseModel')


const createCourse = async (req, res) => {
    try {
        let body = req.body;
        let { title, description, videoUrl, topics, duration, category } = body;
        let id = req.params.id;

        //-----------------[Require field validation]
        if (Object.keys(body).length == 0) return res.status(400).send({ status: false, message: "Please Enter data" })

        //-----------------[validation]
        if (!title) return res.status(400).send({ status: false, message: 'Please enter title' })
        if (!description) return res.status(400).send({ status: false, message: 'Please enter description' })
        if (!videoUrl) return res.status(400).send({ status: false, message: 'Please enter videoUrl' })
        if (!topics) return res.status(400).send({ status: false, message: 'Please enter topics' })
        if (!duration) return res.status(400).send({ status: false, message: 'Please enter duration' })
        if (!category) return res.status(400).send({ status: false, message: 'Please enter category' })

        topics = topics.split(',')
        body.topics = topics;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'admin' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[create course]
        let course = await courseModel.create(body);
        res.status(201).send({ status: true, message: 'course created successfully', data: course })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const updateCourse = async (req, res) => {
    try {
        let body = req.body;
        let id = req.params.id;
        let courseId = req.params.courseId;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'admin' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        let { title, description, videoUrl, topics, duration, category } = body;
        
        //-----------------[find course]
        let course = await courseModel.findOne({ _id: courseId, isDeleted: false });

        //-----------------[update data]
        if (title) course.title = title;
        if (description) course.description = description;
        if (videoUrl) course.videoUrl = videoUrl;
        if (topics) {
            topics = topics.split(',');
            let del = course.topics.map((e) => e)
            for (let i = 0; i < topics.length; i++) {
                if (del.includes(topics[i])) {
                    course.topics.splice(del.indexOf(topics[i]), 1);
                }
                else course.topics.push(topics[i]);
            };
        };
        if (duration) course.duration = duration;
        if (category) course.category = category;
        course.approve = false;

        //-----------------[update]
        await courseModel.updateOne({ _id: courseId, isDeleted: false }, course, { new: true });

        res.status(200).send({ status: true, message: 'updated successfully' });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

const deleteCourse = async (req, res) => {
    try {
        let id = req.params.id;
        let courseId = req.params.courseId;

        //-----------------[find user]
        let user = await model.findOne({ _id: id, role: 'admin' })
        if (!user) return res.status(404).send({ status: false, message: 'not valid user' });

        //-----------------[find course]
        let course = await courseModel.findOneAndUpdate({ _id: courseId, isDeleted: false }, { isDeleted: true }, { new: true });
        if (!course) return res.status(404).send({ status: false, message: 'course not found' })

        res.status(200).send({ status: true, message: 'deleted successfully' });

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

module.exports = { createCourse, updateCourse, deleteCourse }