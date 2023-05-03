const express = require("express");
const Joi = require("joi");
const recordRoute = express.Router();
const Record = require("../models/Record");

const recordSchema = Joi.object({
    person: Joi.string().required(),
    associated_with: Joi.object({
        id: Joi.string().required(),
        full_name: Joi.string().required(),
        id_number: Joi.string().required(),
        date_of_birth: Joi.string().required(),
        address: Joi.string().required(),
        remarks: Joi.string().required(),
        annotation: Joi.number().required()
    })
});


// Get all Records - GET Request
recordRoute.get("/", async (req, res) => {
    try {
        const allRecords = await Record.find();
        return res.status(200).json(allRecords);
    } catch (err) {
        console.log(err);
    }
});

// Get specific record - GET Request
recordRoute.get("/:id", async (req, res) => {
    try {
        const foundRecord = await Record.findById(req.params.id);
        if (!foundRecord) return res.status(404).send("Patient not found");
        return res.status(200).json(foundRecord);
    } catch (err) {
        console.log(err);
    }
});

// Add patient post request
// recordRoute.post("/add_record", async (req, res) => {
//     const validationMsg = recordRoute.validate(req.body);

//     if (validationMsg.error) {
//         res.status(404).json(validationMsg.error.details[0].message);
//     } else {
//         const addRecordResponse = await Patient.create({
//             sensor: req.body.sensor,
//             person: req.body.person,
//             dont_know: req.body.dont_know,
//             time_stamp: req.body.time_stamp,
//             data: req.body.data,
//             associated_with: req.body.associated_with
//         });
//         res.status(200).json(addRecordResponse?.sensor + " has successfully added");
//     }
// });


// Associate record with patient
recordRoute.patch("/associate_patient/:id", async (req, res) => {
    const validationMsg = recordSchema.validate(req.body);

    const { associated_with: { id, full_name, id_number, date_of_birth, address, remarks, annotation } } = req.body;
    if (validationMsg.error) {
        res.send(validationMsg.error.details[0].message);
    } else {
        try {
            const updatedRecord = await Record.updateOne(
                { _id: req.params.id },
                {
                    $set: {
                        person: req.body.person,
                        associated_with: req.body.associated_with
                    },
                }
            );
            res.send(`Patient ${req.body.associated_with.full_name} has successfully Associated`);
        } catch (err) {
            res.send(err);
        }

    }
});

module.exports = recordRoute;