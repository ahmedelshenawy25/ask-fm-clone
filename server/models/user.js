/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const dotenvPath = process.env.NODE_ENV === 'development'
    ? '../config/.env.dev'
    : '../config/.env.prod';

require('dotenv').config({ path: path.join(__dirname, dotenvPath) });

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8
        }
    },
    {
        timestamps: true
    }
);

// hash user password if new or modified
// eslint-disable-next-line consistent-return
userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) return next();
    user.password = await bcrypt.hash(user.password, 10);
});

// authenticate user by (email or username) and password
userSchema.statics.findByCredentials = async function (login, password) {
    const user = await this.findOne().or([{ email: login }, { username: login }]);
    if (!user) {
        throw new Error('Invalid username or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid username or password.');
    }

    return user;
};

// generate and return jwt
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id, username: this.username }, process.env.SECRET_KEY, { expiresIn: '7d' });
    return token;
};

module.exports = mongoose.model('User', userSchema);
