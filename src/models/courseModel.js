const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        videoUrl: {
            type: String,
            required: true,
            trim: true
        },

        topics: {
            type: [String],
            required: true,
        },

        duration: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        approve: {
            type: Boolean,
            default: false
        }

    }, { timestamps: true })

module.exports = mongoose.model('course', courseSchema)