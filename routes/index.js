module.exports = function(app,passport){

    app.get('/else', isLoggedIn, function (req, res) {
        console.log("req user",req.user);
        //render home page dependently on client/coach
        res.render('index');
    }); //todo redirect to coach/client

    app.get('/signup', function (req, res) {
        //res.render('index')
        res.render('register_forms/register_1.dust');
    })

    app.get('/login',(req,res) => {
        res.render('login')
    });

    app.post('/signup', passport.authenticate('local-register', {
        successRedirect : '/', //todo redirect to the choice between coach/client
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login',{
            successRedirect : '/',
            failureRedirect : '/login',
            failureFlash: true
        }
    ));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
        // if they aren't render login page
        res.render('login');
    }
};