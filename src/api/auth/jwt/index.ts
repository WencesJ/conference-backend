import { signToken, checkToken } from "./jwt";
import { jwt } from "../config";

/**
 * 
 * @param data string | object | Buffer 
 * @param expiresIn string value that would have the end prefix: 's' | 'h' | 'd', default = '1h'
 */
export function createToken(data: object, expiresIn: string = '1h') {
    const options = {
        ...jwt,
        expiresIn: jwt.EXPIRES || expiresIn
    }

    return signToken(data, options);
}

export function verifyToken(token: string) {
    return checkToken(token, jwt);
}