const mongoose = require("mongoose");
const recordSchema = mongoose.Schema({
    sensor: {
        type: String,
        required: true,
    },
    person: {
        type: String,
        required: true,
    },
    dont_know: {
        type: String,
        required: true,
    },
    time_stamp: {
        type: String,
        required: true,
    },
    data: {
        type: Array,
        required: true
    },
    associated_with: {
        type: Object
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Record", recordSchema);