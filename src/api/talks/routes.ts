// importing the modules

import { Router } from 'express';

import Controller from './controller';

import { Controller as userCntrl } from '@api/users';

import { reqValidate } from '@libs/validations';
import sanitize from './sanitize';

const {
    createTalk,
    getAllTalks,
    getMyTalks,
    getTalk,
    updateTalk,
    addAttendeeToTalk,
    removeAttendeeFromTalk
} = Controller;

const {
    authorization
} = userCntrl;

const router = Router();
router.use(authorization);

router.get('/myTalks', getMyTalks)
router.route('/')
      .get(getAllTalks)
      .post(reqValidate(sanitize.createTalk), createTalk);

router.route('/:_id')
      .get(reqValidate(sanitize.getTalk), getTalk)
      .patch(reqValidate(sanitize.updateTalk), updateTalk);

router.post('/:_id/addAttendee', reqValidate(sanitize.addOrRemoveAttendee), addAttendeeToTalk);

router.post('/:_id/removeAttendee', reqValidate(sanitize.addOrRemoveAttendee), removeAttendeeFromTalk);

export default router;
