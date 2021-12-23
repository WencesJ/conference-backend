import express from 'express';
import logger from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import hpp from 'hpp';
import cors from 'cors';
import expressSession from 'express-session';

// user custom modules
import { AppError, errorController as globalErrorHandler } from '@libs/error';
import HELPERS from '@libs/shared/helpers';
// import { rateLimiter } from '@libs/shared/helpers/helper';

const { Server } = require("socket.io");
const http = require("http");


//routers
import routers from 'api/index.routes';

const xss = require('xss-clean');
//helpers

export function app_init() {
    const { corsOptions } = HELPERS;

    const corsSetup = cors(corsOptions);

    let app = express();

    //trust proxy

    app.set('trust proxy', 1);

    // GLOBAL MIDDLEWARES

    // DEVELOPMENT LOGGING
    if (process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    } else {
        app.use(logger('tiny'));
    }

    // IMPLEMENTING CORS FOR ALL ROUTES
    app.options('*', corsSetup);

    // const SESSION_CREDENTIALS = sessionParams(expressSession);

    // app.use(expressSession({ ...SESSION_CREDENTIALS }));

    // BODY-PARSER, READING DATA = body INTO req.body
    app.use(express.json({ limit: '10kb' }));

    // GRABBING URL QUERIES
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // SET SECURITY HEADERS
    app.use(helmet());

    // PREVENT PARAMETER POLLUTION
    app.use(
        hpp({
            whitelist: [],
        })
    );

    // DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
    app.use(mongoSanitize());

    // DATA SANITIZATION AGAINST XSS
    app.use(xss());

    // COMPRESSING TEXT RESPONSES
    // app.use(compression()); // USED DURING PRODUCTION PHASE

    app.use(cors(corsOptions));

    // IMPLEMENTING RATE LIMITING
    // TODO: Make Function Flexible by implementing parameter injection for rate limit expiration time

    // setting the rate limiters
    // app.use('*', rateLimiter(50));


    // FEATURE ROUTERS
    app.use('/api/v1', routers);

    app.all('*', (req, res, next) => {
        return next(
            new AppError(
                `Wrong url '${req.originalUrl}'. This url doesn't exist!`,
                404
            )
        );
    });

    app.use(globalErrorHandler);

    const server = http.createServer(app);


    const io = new Server(server, {
        cors: {
            origin: true,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket: any) => {
        console.log(`User Connected: ${socket.id}`);
      
        socket.on("join_room", (data: any) => {
          socket.join(data);
          console.log(`User with ID: ${socket.id} joined room: ${data}`);
        });
      
        socket.on("send_message", (data: any) => {
          socket.to(data.subject).emit("receive_message", data);
        });
      
        socket.on("disconnect", () => {
          console.log("User Disconnected", socket.id);
        });
      });

    return server;

};
