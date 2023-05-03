const express = require("express");
const patientRoute = express.Router();
const Patient = require("../../models/Patient");
const Joi = require("joi");

const patientSchema = Joi.object({
    full_name: Joi.string().min(3).max(100).required(),
    id_number: Joi.string().length(11).pattern(/^[0-9]+$/).required(),
    date_of_birth: Joi.string().isoDate().required(),
    address: Joi.string().min(5).max(100).required(),
    comment: Joi.string().min(5).max(500),
    remarks: Joi.string().required(),
    annotation: Joi.number(),
    associated_with: Joi.object({
        recordId: Joi.string().required(),
        sensor: Joi.string().required(),
        person: Joi.number().required(),
        data: Joi.array().required(),
    })
});

// Get all Patients - GET Request
patientRoute.get("/", async (req, res) => {
    try {
        const allPatients = await Patient.find();
        return res.status(200).json(allPatients);
    } catch (err) {
        console.log(err);
    }
});

// Get specific Patient - GET Request
patientRoute.get("/:id", async (req, res) => {
    try {
        const foundPatient = await Patient.findById(req.params.id);
        if (!foundPatient) return res.status(404).send("Patient not found");
        return res.status(200).json(foundPatient);
    } catch (err) {
        console.log(err);
    }
});

// Add patient post request
patientRoute.post("/add_patient", async (req, res) => {
    const validationMsg = patientSchema.validate(req.body);

    if (validationMsg.error) {
        res.send(validationMsg.error.details[0].message);
    } else {
        const alreadyRegister = await Patient.findOne({ id_number: req.body.id_number });
        if (alreadyRegister) {
            res.send("The patient with Id number has already register");
            console.log(alreadyRegister);
        } else {
            const { associated_with: { recordId, sensor, data } } = req.body;
            // insert into DB!!!
            const addPatientResponse = await Patient.create({
                full_name: req.body.full_name,
                id_number: req.body.id_number,
                date_of_birth: req.body.date_of_birth,
                address: req.body.address,
                comment: req.body.comment,
                remarks: req.body.remarks,
                annotation: req.body.annotation,
                associated_with: req.body.associated_with

            });
            res.status(200).json(addPatientResponse);
        }
    }
});

// Update patient - PATCH Request
patientRoute.patch("/:id", async (req, res) => {
    try {
        const updatedPatient = await Patient.updateOne(
            { _id: req.params.id },
            {
                $set: {
                    full_name: req.body.full_name,
                    id_number: req.body.id_number,
                    date_of_birth: req.body.date_of_birth,
                    address: req.body.address,
                    comment: req.body.comment
                },
            }
        );
        res.status(200).json(`${req.body.full_name} has successfully updated...`);
    } catch (err) {
        res.send(err);
    }
});

// patient deletion - DELETE Request
patientRoute.delete("/:id", async (req, res) => {
    try {
        const deleteRide = await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json(`The patient has been deleted`);
    } catch (err) {
        res.send(err);
    }
});

module.exports = patientRoute;