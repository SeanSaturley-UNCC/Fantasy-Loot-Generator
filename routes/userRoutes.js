const express = require('express')
const router = express.Router()
const { authenticate } = require('../utils')
const UserController = require('../controllers/UserController')

router.route('/')
    //! Create a new user
    .post(
        UserController.createUser
    )
    //! Get all users
    .get(
        authenticate,
        UserController.getAllUsers
    )

router.route('/:id')
    //! Get one user
    .get(
        authenticate,
        UserController.getOneUser
    )

router.route('/login').post(
    //! login user
    UserController.loginUser
)

router.route('/logout/:userId').put(
    // authenticate,
    //! logout user
    UserController.logoutUser
)

router.route('/check-session').post(
    //! checks if the user has an active session
    authenticate,
    UserController.checkSession
)

router.route('/:id').delete(
    //! deletes a user by id
    authenticate,
    UserController.deleteOne
)

module.exports = router;