import express from 'express'
import { authenticate } from '../middleware/utils'
import * as UserController from '../controllers/UserController'

const router = express.Router()

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
    // authenticate,
    UserController.checkSession
)

router.route('/:id').delete(
    //! deletes a user by id
    authenticate,
    UserController.deleteOne
)

export default router
