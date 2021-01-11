const authController = require('../controllers').auth;
const userController = require('../controllers').user;
const validateToken = require('../middleware/authorization').validateToken;

module.exports = app => {
    // Auth
    app.post('/api/login', authController.login);
    app.post('/api/register', authController.register);

    // User
    app.get('/api/users', validateToken, userController.getUsers);
    app.post('/api/user', validateToken, userController.createUser);
    app.put('/api/user', validateToken, userController.updateUser);
    app.delete('/api/user/:user_id', validateToken, userController.deleteUser);
}