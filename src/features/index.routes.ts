import { Router } from 'express';

//Features
import { Router as userRouter } from '@features/wallets';

import { STATUS } from '@libs/shared/constants/responseConstants';

const router = Router();

router.use('/wallets', userRouter);

router.get('/', (_, res) => {
    res.status(STATUS.ACCEPTED).json({
        greetings: '<h1>Welcome to Figo-Payment Api 1</h1>'
    });
});
export default router;
