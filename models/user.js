var mongoose = require('mongoose'),
    validator = require('validator'),
    _ = require('lodash'),
    bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 6,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        minlength: 6,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
    }
});

UserSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

var User = mongoose.model('User', UserSchema);

module.exports = {User};
