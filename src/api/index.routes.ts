import { Router } from 'express';

//Features
import { Router as userRouter } from '@api/users';
import { Router as talkRouter } from '@api/talks';

import { STATUS } from '@libs/shared/constants/responseConstants';

const router = Router();

router.use('/users', userRouter);
router.use('/talks', talkRouter);

router.get('/', (_, res) => {
    res.status(STATUS.ACCEPTED).json({
        greetings: '<h1>Welcome to conference Api 1</h1>'
    });
});
export default router;
