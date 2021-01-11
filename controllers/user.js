const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    getUsers: async (req, res) => {
        try {
            const users = await User.find({});
            if (!users.length) {
                return res.status(404).send({
                    status: false,
                    message: 'No users found'
                })
            }

            res.status(200).send(users);
        } catch (err) {
            res.status(400).send(err);
        }
    },

    createUser: async (req, res) => {
        const { user } = req.body;

        try {
            const existingUser = await User.find({ email: user.email });

            console.log('existing User --->', existingUser.length);

            if (existingUser.length > 0) {
                res.status(400).send({
                    success: 'false',
                    message: 'User already exists',
                })
            } else {
                const newUser = await User.create(user);

                console.log('newUser --->');

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

                            res.status(201).send(newUser);
                        }
                    });
                });
            }
        } catch (err) {
            res.status(400).send(err);
        }
    },

    updateUser: async (req, res) => {
        const { user } = req.body;

        try {
            const targetUser = await User.findById(user._id);

            if (!targetUser) {
                return res.status(404).send({
                    status: 'failed',
                    message: 'User does not exist'
                })
            }

            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(user.password, salt, async (err, hash) => {
                    if (err) {
                        res.status(400).send({
                            success: 'false',
                            message: 'password hash error',
                        })
                    } else {
                        const updatedUser = await User.findByIdAndUpdate(user._id, {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            password: hash,
                            phoneNumber: user.phoneNumber,
                            bio: user.bio
                        });

                        res.status(200).send(updatedUser);
                    }
                });
            });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    deleteUser: async (req, res) => {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).send({
                status: 'failed',
                message: 'User id is missing'
            })
        }

        try {
            const user = await User.findByIdAndDelete(user_id);

            if (!user) {
                return res.status(404).send({
                    status: 'failed',
                    message: 'User not found'
                });
            }

            res.status(200).send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    }
}