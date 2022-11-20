const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        role: {
            type: String,
            required: true,
            default: 'employee',
            emun: ["employee", "admin", "superAdmin"]
        },

        password: {
            type: String,
            required: true,
            minLen: 8,
            maxLen: 15,
            trim: true
        },

    }, { timestamps: true })

module.exports = mongoose.model('user', userSchema)