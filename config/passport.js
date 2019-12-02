const LocalStrategy = require('passport-local').Strategy;

let Credentials = require('../models/Credential');
let UserAccount = require('../models/UserAccount');

module.exports = function (passport) {
    passport.serializeUser(function(cred, done) {
        done(null, cred.id);
    });

    passport.deserializeUser(function(id, done) {
        Credentials.findById(id, function(err, cred) {
            done(err, cred);
        });
    });

    passport.use('local-register', new LocalStrategy({
            // by default, local strategy uses username and password
            passReqToCallback : true // allows us to pass back the entire request to the callback
        }, function(req, username, password, done) {
        console.log(username);
        console.log(password);
        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(async function() {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            try {
                let found =  await Credentials.findOne({username :  username });
                // check to see if theres already a user with that email
                if (found) {//TODO render later on error this message
                    return done(null, false, req.flash('signup-Message', 'That username is already taken.'));
                } else {
                    let cred = new Credentials();
                        cred.username = username;
                        cred.password = cred.generateHash(password);
                    let saved = await cred.save();
                    return done(null, saved);
                }
            } catch (err) {
                // if there are any errors, return the error
                return done(err);
            }});
        })
    );

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            Credentials.findOne({ username :  username }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err)
                    return done(err);
                console.log("user",user);
                console.log("password",password);
                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

                // if the user is found but the password is wrong
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, user);
            });

        }));
};