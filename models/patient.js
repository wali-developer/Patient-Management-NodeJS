const mongoose = require("mongoose");
const patientSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    id_number: {
        type: Number,
        required: true,
    },
    date_of_birth: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
    },
    remarks: {
        type: String,
        required: true
    },
    annotation: {
        type: Number,
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

module.exports = mongoose.model("Patient", patientSchema);