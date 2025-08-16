import { portNumber, frontendPath } from './config';

import userRoutes from './routes/userRoutes';
import showRoutes from './routes/showRoutes';
import fileRoutes from './routes/fileRoutes';
import venueRoutes from './routes/venueRoutes';

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errors } from 'celebrate';
import path from 'path';
import http from 'http';

const app = express();
const server = http.createServer(app);
app.use(cors());

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// static file hosting
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, frontendPath)));

// add routes
app.use('/api/users', userRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/venues', venueRoutes);
app.use(errors());

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, `${frontendPath}/index.html`));
});

// start server
server.listen(portNumber);