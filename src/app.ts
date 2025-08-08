import portNumber from './config';
import userRoutes from './routes/userRoutes';
import showRoutes from './routes/showRoutes';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import path from 'path';
import http from 'http'

const app = express();
const server = http.createServer(app);
app.use(cors());

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// add routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use(errors());

// static file hosting for frontend
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../../fruitfly-website/build/index.html"));
});

// start server
server.listen(portNumber);