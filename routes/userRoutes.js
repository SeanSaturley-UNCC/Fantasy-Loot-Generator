const express = require('express');
const router = express.Router();
// const { authenticate } = require('../controllers/AuthenticationController');
const UserController = require('../controllers/UserController');
// const { setupUserValidation, updateUserValidation } = require('../validations/userValidation');

const authenticate = (req, res, next) => {
    // You can add actual authentication logic here
    next()
}

router.route('/')
    .post(
        authenticate,
        UserController.createUser
    )
    .get(
        authenticate,
        UserController.getAllUsers
    )

// router.route('/setup/:id').put(
//     authenticate,
//     validate(setupUserValidation, true),
//     UserController.setupUser
// )

router.route('/:id')
    .get(
        authenticate,
        UserController.getOneUser
    )
    // .put(
    //     authenticate,
    //     validate(updateUserValidation, true),
    //     UserController.updateUser
    // )

// router.route('/password/:id')
//     .post(
//         authenticate,
//         UserController.updateUserPassword
//     )

router.route('/login').post(
    UserController.loginUser
)

router.route('/logout/:userId').put(
    authenticate,
    UserController.logoutUser
)

router.route('/check-session').post(
    authenticate,
    UserController.checkSession
)

// router.route('/:id').delete(
//     authenticate,
//     UserController.deleteOne
// )

// router.route('/:id/hard').delete(
//     authenticate,
//     UserController.hardDeleteOne
// )

// router.route('/:id/superAdmin').get(
//     authenticate,
//     UserController.userIsSuperAdmin
// )

module.exports = router;