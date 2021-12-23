// importing the modules

import { Router } from 'express';

import Controller from './controller';

import { reqValidate } from '@libs/validations';
import sanitize from './sanitize';

const {
    signUp,
    logIn,
    logOut,
    getUser,
    updateUser,
    changePassword,
    changeEmail,
    authorization,
} = Controller;

const router = Router();

router.post('/signup', reqValidate(sanitize.createUser), signUp);

router.post('/login', reqValidate(sanitize.loginUser), logIn);

router.use(authorization);

router.post('/logout', logOut);

router.route('/')
      .get(reqValidate(sanitize.getUser), getUser)
      .patch(reqValidate(sanitize.updateUser), updateUser);

router.patch('/:_id/changeEmail', reqValidate(sanitize.changeUserEmail), changeEmail);

router.patch('/:_id/changePassword', reqValidate(sanitize.changeUserPassword), changePassword);  


export default router;
