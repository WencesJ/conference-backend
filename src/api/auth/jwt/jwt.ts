import * as jwt from 'jsonwebtoken';


interface JwtEnv {
    SECRET: string | undefined,
    EXPIRES: string | undefined
}


export function signToken(data: object,  options: JwtEnv) {
    return jwt.sign({ ...data }, options.SECRET!, { expiresIn: options.EXPIRES });
}

export function checkToken(token: string, options: JwtEnv): { error?: string, data?: string | jwt.JwtPayload } {
    try {
       const decoded = jwt.verify(token, options.SECRET!) as Record<string, any>;
       return {
           data: decoded
       }
    }
    catch(err: any) {
        let message = 'Invalid Token. Please Login!';

        if (err.message.includes('expired')) {
            message = 'Token Expired. Please Login!';
        }

        return {
            error: message
        }
    }
}