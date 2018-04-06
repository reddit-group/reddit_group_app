var LocalStrategy = require('passport-local').Strategy,
    {User} = require('../models/user.js');

module.exports = function(passport) {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        process.nextTick(() => {
            User.findOne({'username': username, 'email': req.body.email}, (err, user) => {
                if (err) return done(err);
                if (user) {
                    console.log('Username already taken!');
                    return done(null, false);
                } else {
                    console.log(req.body);

                    var newUser = new User({
                        username: username,
                        email: req.body.email,
                        password: password
                    });

                    newUser.save((err) => {
                        if (err) throw err;
                        return done(null, newUser);
                    });
                }
            })
        });
    }));

    passport.use('local-signin', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, username, password, done) => {
        User.findOne({'username': username}, (err, user) => {
            if (err) return done(err);
            if (!user) {
                console.log('No user exists');
                return done(null, false);
            }
            user.comparePassword(password, (err, isMatch) => {
                if (isMatch) {
                    console.log('Password matches');
                    return done(null, user);
                } else {
                    console.log('Password does not match');
                    return done(null, false);
                }
            });
        });
    }));
}
