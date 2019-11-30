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
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
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
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
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
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
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
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
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

/* SEARCHES BY... */
// Search schedules by...
router.get('/schedules/search', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
        try {
            let filter = getFilter(req);
            let found = await Schedule.findOne({filter});
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

// Search sessions by...
router.get('/sessions/search', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
        try {
            let filter = getFilter(req);
            let found = await Session.findOne({filter});
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

// Search exercises by...
router.get('/exercises/search', async (req, res) => {
    if ((req.get('Content-Type') === "application/json" && req.get('Accept') === "application/json") || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.get('Accept') === "application/json")) {
        try {
            let filter = getFilter(req);
            let found = await Exercise.findOne({filter});
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

                if (req.body.duration !== undefined) {
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
                res = setResponse('json', 400, res, {Error: "Exercise sequence number, name, description, weight units, pump weight, body part, set and repetitions must be provided."});
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
// Update schedule // pending push to sessions[]
router.put('/schedules/edit/:id', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Editing schedule...');
            console.log('Searching for schedule with ID: ' + req.params.id + '.');
            let found = await Schedule.findById({_id: req.params.id});

            if (found !== null) {
                if (req.body.name === undefined) {
                    found.name = req.body.name;
                }
                if (req.body.startDate === undefined) {
                    found.startDate = req.body.startDate;
                }
                if (req.body.endDate === undefined) {
                    found.endDate = req.body.endDate;
                }
                if (req.body.sessions !== undefined) { // assigns sessions to schedule
                    found.sessions = req.body.sessions;
                }
                let saved = await found.save();
                res = setResponse('json', 200, res, saved);
            } else {
                res = setResponse('json', 404, res);
            }
            res.end();
        } else {
            res = setResponse('json', 400, res, {Error: "Only application/json and application/x-www-form-urlencoded 'Content-Type' is allowed."});
            res.end();
        }
    } catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

// Update session // pending push to exercises[]
router.put('/sessions/edit/:id', async (req, res) => {
    try {
        if ((req.get('Content-Type') === "application/json" && req.accepts("application/json")) || (req.get('Content-Type') === "application/x-www-form-urlencoded" && req.accepts("application/json"))) {
            console.log('Editing session...');
            console.log('Searching for session with ID: ' + req.params.id + '.');
            let found = await Session.findById({_id: req.params.id});

            if (found !== null) {
                if (req.body.weekday !== undefined) {
                    found.weekday = req.body.weekday;
                }
                if (req.body.duration !== undefined) {
                    found.duration = req.body.duration;
                }
                if (req.body.exercises !== undefined) { // assigns exercises to session
                    found.exercises = req.body.exercises;
                }
                let saved = await found.save();
                res = setResponse('json', 200, res, saved);
            } else {
                res = setResponse('json', 404, res);
            }
            res.end();
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
            console.log('Editing exercise...');

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
                    exercise.comment = req.body.comment;
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

/* DELETE */
// Deletes an schedule
router.delete('/schedules/delete/:id', async (req, res) => {
    try {
        if (req.accepts("json")) {
            let found = await Schedule.findById({_id: req.params.id});
            await found.remove();
            console.log('Schedule with ID ' + req.params.id + ' was successfully deleted!');
            if (req.accepts("text/html")) {
                res = setResponse('html', 200, res);
            } else if (req.accepts("application/json")) {
                res = setResponse('json', 200, res, {Result: `Schedule with ID ` + found._id.toString() + ` was successfully deleted!`});
                res.end();
            }
        } else {
            res = setResponse('error', 404, res, {Error: 'Schedule not found!'});
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Deletes an schedule
router.delete('/sessions/delete/:id', async (req, res) => {
    try {
        if (req.accepts("json")) {
            let found = await Session.findById({_id: req.params.id});
            await found.remove();
            console.log('Session with ID ' + req.params.id + ' was successfully deleted!');
            if (req.accepts("text/html")) {
                res = setResponse('html', 200, res);
            } else if (req.accepts("application/json")) {
                res = setResponse('json', 200, res, {Result: `Session with ID ` + found._id.toString() + ` was successfully deleted!`});
                res.end();
            }
        } else {
            res = setResponse('error', 404, res, {Error: 'Session not found!'});
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// Deletes an exercise
router.delete('/exercises/delete/:id', async (req, res) => {
    try {
        if (req.accepts("json")) {
            let found = await Exercise.findById({_id: req.params.id});
            await found.remove();
            console.log('Exercise with ID ' + req.params.id + ' was successfully deleted!');
            if (req.accepts("text/html")) {
                res = setResponse('html', 200, res);
            } else if (req.accepts("application/json")) {
                res = setResponse('json', 200, res, {Result: `Exercise with ID ` + found._id.toString() + ` was successfully deleted!`});
                res.end();
            }
        } else {
            res = setResponse('error', 404, res, {Error: 'Exercise not found!'});
        }
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end();
    }
});

// HELPERS //
// Creates filter for searching workout related documents on the database
function getFilter(req) {
    const filter = {};
    let request;

    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    }

    if (request !== undefined) {
        // Filter by ID
        if (request.id !== undefined && mongoose.Types.ObjectId.isValid(request.id)) {
            filter._id = request.id;
        }

        // Filter by name
        if (request.name !== undefined) {
            filter.name = request.name;
        }

        // Filter by body part
        if (request.bodyPart !== undefined) {
            filter.bodyPart = request.bodyPart;
        }

        // Filter by start date
        if (request.startDate !== undefined) {
            filter.startDate = request.startDate;
        }

        // Search by end date
        if (request.endDate !== undefined) {
            filter.endDate = request.endDate;
        }

        // Search by weekday
        if (request.weekday !== undefined) {
            filter.weekday = request.weekday;
        }

        // Search by duration
        if (request.duration !== undefined) {
            filter.duration = request.duration;
        }

        // Search by coachId
        if (request.coachId !== undefined) {
            filter._coachId = request.coachId;
        }

        // Search by coachId
        if (request.clientId !== undefined) {
            filter._clientId = request.clientId;
        }

        // Search non deleted
        if (request.isDeleted === undefined) {
            filter.isDeleted = false;
        } else {
            filter.isDeleted = request.isDeleted;
        }
        return filter;
    }
}

// Creates custom responses
function setResponse(type, code, res, msg) {
    res.status(code);
    switch (type) {
        case 'json':
            res.set('Content-Type', 'application/json');
            res.json(msg);
            return res;
            break;
        case 'html':
            return res.set('Content-Type', 'text/html');
            break;
        case 'error':
            res.json(msg);
            return res;
            break;
        default:
            break;
    }
}

module.exports = router;
