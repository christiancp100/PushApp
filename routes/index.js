module.exports = function(app,passport){

    app.get('/register', function (req, res) {
        res.render('register_forms/register_1.dust');
    });

    app.get('/register/coach', function (req, res) {
        return res.render('register_forms/coach-register.dust');
    })

    app.get('/register/client', function (req, res) {
        return res.render('register_forms/client-register.dust');
    })

    app.get('/signup', function (req, res) {
        res.render('register_forms/register-credentials.dust');
    })

    app.get('/login',(req,res) => {
        res.render('login')
    });

    app.post('/signup', passport.authenticate('local-register', {
        successRedirect : '/',//todo go to dynamic routes
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.post('/login', passport.authenticate('local-login',{
            failureRedirect : '/login',
            failureFlash: true
        }),
        function (req, res) {
             res.redirect('/' + req.user.username);
        }
    );

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    //todo use this middleware function to routes!!!!!

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();
        // if they aren't render login page
        res.redirect('/signup');
    }
};