import express from 'express'
import { authenticate } from '../middleware/utils'
import * as loot from '../controllers/lootController'

const router = express.Router()

router.route('/generate')
    //! Generate a new loot item
    .get(
        authenticate,
        loot.generateLoot
    )

router.route(
    '/save'
).post(
    authenticate,
    loot.saveLoot
)

router.route(
    '/inventory/:userId'
).get(
    authenticate,
    loot.getUserInventory
)

router.route(
    '/discard/:lootId'
).delete(
    authenticate,
    loot.discardLoot
)

export default router
