// importing the modules

import { Router } from 'express';

import Controller from './controller';

const {
    signUp,
    logIn,
    logOut,
    getWallet,
    updateWallet,
    transferFunds,
    changePassword,
    changeEmail,
    authorization,
    authorizedUser
} = Controller;

import { reqValidate } from '@libs/validations';
import './sanitize';


const router = Router();

router.post('/signup', reqValidate('createWallet'), signUp);

router.post('/login', reqValidate('loginWallet'), logIn);

router.use(authorization);

router.post('/logout', logOut);

router.route('/:company')
      .get(reqValidate('getWallet'), authorizedUser, getWallet)
      .patch(reqValidate('updateWallet'), authorizedUser, updateWallet);

router.post('/:company/transfer', reqValidate('walletTransferFunds'), authorizedUser, transferFunds)  

router.patch('/:company/change-email', reqValidate('changeWalletEmail'), changeEmail);

router.patch('/:company/change-password', reqValidate('changeWalletPassword'), changePassword);  


export default router;
