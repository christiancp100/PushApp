/** @module root/router */
'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

require('../../models/Schedule.js');
require('../../models/Session.js');
require('../../models/Exercise.js');

let Schedule = mongoose.model('Schedule');
let Session = mongoose.model('Session');
let Exercise = mongoose.model('Exercise');

/* GETS */
// Get ALL at /workouts root, not serving data
router.get('/', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json")) {
        try {
            res = setResponse('json', 400, res, {Message: 'Nothing here. Go exercise!'});
            res.end();
        } catch (err) {
            console.log(err);
            res.status(500);
            res.end();
        }
    } else {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Get ALL schedules
router.get('/schedules', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json")) {
        try {
            let found = await Schedule.find({});
            res = setResponse('json', 200, res, found);
            res.end();
        } catch (err) {
            console.log(err);
            res.status(500);
            res.end();
        }
    } else {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Get ALL sessions
router.get('/sessions', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json")) {
        try {
            let found = await Session.find({});
            res = setResponse('json', 200, res, found);
            res.end();
        } catch (err) {
            console.log(err);
            res.status(500);
            res.end();
        }
    } else {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Get ALL exercises
router.get('/exercises', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json")) {
        try {
            let found = await Exercise.find({});
            res = setResponse('json', 200, res, found);
            res.end();
        } catch (err) {
            console.log(err);
            res.status(500);
            res.end();
        }
    } else {
        console.log(err);
        res.status(500);
        res.end();
    }
});

/* POSTS */
// Create new schedule
router.post('/schedules/new', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Creating new schedule...');

            if (req.body._coachId === undefined &&
                req.body._clientId === undefined &&
                req.body.name === undefined &&
                req.body.startDate === undefined &&
                req.body.endDate === undefined) {
                res = setResponse('json', 400, res, {Error: "Coach ID, Client ID, schedule name, start date and final date must be provided"});
                res.end();
            } else {
                let schedule = new Schedule({
                    _coachId: req.body._coachId,
                    _clientId: req.body._clientId,
                    name: req.body.name,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                });

                let savedSchedule = await schedule.save();

                res = setResponse('json', 200, res, savedSchedule);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Create new session
router.post('/sessions/new', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Creating new session...');

            if (req.body._coachId === undefined &&
                req.body._clientId === undefined &&
                req.body.weekday === undefined) {
                res = setResponse('json', 400, res, {Error: "Coach ID, Client ID and weekday must be provided"});
                res.end();
            } else {
                let session = new Session({
                    _coachId: req.body._coachId,
                    _clientId: req.body._clientId,
                    weekday: req.body.weekday
                });

                if (req.body.weekday === undefined) {
                    session.duration = req.body.duration;
                }
                let savedSession = await session.save();

                res = setResponse('json', 200, res, savedSession);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch
        (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Create new exercise
router.post('/exercises/new', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Creating new exercise...');

            if (req.body.name === undefined &&
                req.body.description === undefined &&
                req.body.weightUnit === undefined &&
                req.body.pumpWeight === undefined &&
                req.body.bodyPart === undefined &&
                req.body.set === undefined &&
                req.body.repetitions === undefined) {
                res = setResponse('json', 400, res, {Error: "Exercise name, description, weight units, pump weight, body part, set and repetitions must be provided."});
                res.end();
            } else {
                let exercise = new Exercise({
                    name: req.body.name,
                    description: req.body.description,
                    weightUnit: req.body.weightUnit,
                    pumpWeight: req.body.pumpWeight,
                    bodyPart: req.body.bodyPart,
                    set: req.body.set,
                    repetitions: req.body.repetitions
                });

                if (req.body.comment === undefined) {
                    session.comment = req.body.comment;
                }
                let savedExercise = await exercise.save();

                res = setResponse('json', 200, res, savedExercise);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch
        (err) {
        console.log(err);
        res.status(500).end();
    }
});

/* PUTS */
// Update schedule
router.put('/schedules/edit/:id', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Editing schedule...');

            if (req.body._coachId === undefined &&
                req.body._clientId === undefined &&
                req.body.name === undefined &&
                req.body.startDate === undefined &&
                req.body.endDate === undefined) {
                res = setResponse('json', 400, res, {Error: "Coach ID, Client ID, schedule name, start date and final date must be provided"});
                res.end();
            } else {
                let schedule = new Schedule({
                    _coachId: req.body._coachId,
                    _clientId: req.body._clientId,
                    name: req.body.name,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate
                });

                let savedSchedule = await schedule.save();

                res = setResponse('json', 200, res, savedSchedule);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Update session
router.put('/sessions/edit/:id', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Editing session...');

            if (req.body._coachId === undefined &&
                req.body._clientId === undefined &&
                req.body.weekday === undefined) {
                res = setResponse('json', 400, res, {Error: "Coach ID, Client ID and weekday must be provided"});
                res.end();
            } else {
                let session = new Session({
                    _coachId: req.body._coachId,
                    _clientId: req.body._clientId,
                    weekday: req.body.weekday
                });

                if (req.body.weekday === undefined) {
                    session.duration = req.body.duration;
                }
                let savedSession = await session.save();

                res = setResponse('json', 200, res, savedSession);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch
        (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Update exercise
router.put('/exercises/edit/:id', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Creating new exercise...');

            if (req.body.name === undefined &&
                req.body.description === undefined &&
                req.body.weightUnit === undefined &&
                req.body.pumpWeight === undefined &&
                req.body.bodyPart === undefined &&
                req.body.set === undefined &&
                req.body.repetitions === undefined) {
                res = setResponse('json', 400, res, {Error: "Exercise name, description, weight units, pump weight, body part, set and repetitions must be provided."});
                res.end();
            } else {
                let exercise = new Exercise({
                    name: req.body.name,
                    description: req.body.description,
                    weightUnit: req.body.weightUnit,
                    pumpWeight: req.body.pumpWeight,
                    bodyPart: req.body.bodyPart,
                    set: req.body.set,
                    repetitions: req.body.repetitions
                });

                if (req.body.comment === undefined) {
                    session.comment = req.body.comment;
                }
                let savedExercise = await exercise.save();

                res = setResponse('json', 200, res, savedExercise);
                res.end();
            }
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch
        (err) {
        console.log(err);
        res.status(500).end();
    }
});
module.exports = router;
