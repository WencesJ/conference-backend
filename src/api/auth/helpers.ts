import { sign } from 'jsonwebtoken';

const signToken = (id: string, username: string) => {
    return sign({ id, username }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const _signToken = ({ id, username }: { [unit: string]: string }) => {
    const token = signToken(id, username);

    const cookieOptions: {
        expires: Date;
        httpOnly: boolean;
        secure?: boolean;
    } = {
        expires: new Date(
            Date.now() +
                +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
        ),

        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }

    // res.cookie('jwt', token, cookieOptions);
    return {
        name: 'jwt',
        value: token,
        cookieOptions,
    };
};
export { _signToken as signToken };
