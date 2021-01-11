const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    login: async (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                res.status(400).send(err);
            } else if (!user) {
                res.status(401).send({
                    success: 'false',
                    message: 'Username or password is incorrect.'
                })
            } else {
                //token generation
                const privateKey = process.env.JWT_PRIVATE_KEY;
                const token = jwt.sign({}, privateKey);

                res.status(200).send({
                    user: user,
                    token: token
                });
            }
        })(req, res, next);
    },

    register: async (req, res) => {
        const { user } = req.body;

        try {
            const existingUser = await User.find({ email: user.email });

            if (existingUser.length > 0) {
                res.status(400).send({
                    success: 'false',
                    message: 'User already exists',
                })
            } else {
                const newUser = await User.create(user);

                bcrypt.genSalt(10, async(err, salt) => {
                    bcrypt.hash(newUser.password, salt, async (err, hash) => {
                        if (err) {
                            res.status(400).send({
                                success: 'false',
                                message: 'password hash error',
                            })
                        } else {
                            await newUser.update({
                                password: hash
                            });

                            //token generation
                            const secret = process.env.JWT_PRIVATE_KEY;
                            const token = jwt.sign({}, secret);

                            res.status(201).send({
                                user: newUser,
                                token: token
                            });
                        }
                    });
                });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }
}