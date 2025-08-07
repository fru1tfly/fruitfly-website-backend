import portNumber from './config';
import userRoutes from './routes/userRoutes';
import showRoutes from './routes/showRoutes';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';

const app = express();
app.use(cors());

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use(errors());

// start server
app.listen(portNumber, () => {
    console.log(`Server running on port ${portNumber}`);
}).on('error', err => {
    console.log(err);
    process.exit(1);
});
