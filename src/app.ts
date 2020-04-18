require('./environment').init();

import { resolve }      from 'path';
import { createServer } from 'http';
import createError      from 'http-errors';
import cookieParser     from 'cookie-parser';
import morgan           from 'morgan'
import cors             from 'cors';

import { normalizePort, onError, onListening }                        from './lib/server';
import express, { json, NextFunction, Request, Response, urlencoded } from 'express';

import { homeRouter } from './routes/home';

export const app = express();

// view engine setup
app.set('views', resolve(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(resolve(__dirname, '../public')));

// ROUTES
app.use('/', homeRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// error handler
app.use(
    (
        err: createError.HttpError,
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'dev' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
);

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Server setup
const server = createServer(app);
server.listen(port);
server.on('error', err => onError(port, err));
server.on('listening', () => onListening(server));
