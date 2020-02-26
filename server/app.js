const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const userRouter = require('./routes/user');
const questionRouter = require('./routes/question');

const dotenvPath = process.env.NODE_ENV === 'development'
    ? '/config/.env.dev'
    : '/config/.env.prod';

require('dotenv').config({ path: path.join(__dirname, dotenvPath) });

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('common'));

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api', userRouter);
app.use('/api', questionRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    mongoose.connection
        .once('open', () => {
            if (process.env.NODE_ENV === 'development') {
                require('./data/insertDummyData')();
            }
            // eslint-disable-next-line no-console
            console.log('connected');
        })
        // eslint-disable-next-line no-console
        .on('error', error => console.log(`connection error: ${error}`));
});
