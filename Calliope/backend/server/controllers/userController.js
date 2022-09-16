const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './server/.env' });
//sign up user
function validatedEmail(email) {
    const regex = /\S+@\S+\.\S+/;

    return regex.test(email);
}
const signupUser = async (req, res) => {
    //res.send('Sign up user');

    try {
        const { username, email, password } = req.body;
        let toasts = [];

        if (!username) toasts.push({ message: 'Last name is required', type: 'error' });

        if (!password) toasts.push({ message: 'A valid Password is required', type: 'error' });
        if (password && (password.length < 8 || password.length > 12)) toasts.push({ message: 'Password must be at least 6 - 12 characters long', type: 'error' });

        if (!email || !validatedEmail(email)) toasts.push({ message: 'A valid Email is required', type: 'error' });

        if (toasts.length > 0) return res.status(400).json(toasts);
        let checkUser = await User.findOne({ email });
        if (checkUser) return res.status(400).json([{ message: 'User already exists', type: 'error' }]);

        newUser = new User(req.body);

        const salt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();

        const payload = {
            user: {
                id: newUser._id
            }
        }


        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 28800
        }, (err, token) => {
            if (err) throw err;
            res.json(token);
        });


    } catch (err) {
        console.error('Error: ${err.message}');
    }
}

//sign in user
const signinUser = async (req, res) => {
    //res.send('sign in user');
    try {
        const { email, password } = req.body;
        let toasts = [];
        if (!password) toasts.push({ message: 'A valid Password is required', type: 'error' });
        if (password && (password.length < 8 || password.length > 12)) toasts.push({ message: 'Password must be at least 6 - 12 characters long', type: 'error' });

        if (!email || !validatedEmail(email)) toasts.push({ message: 'A valid Email is required', type: 'error' });

        if (toasts.length > 0) return res.status(400).json(toasts);
        let checkUser = await User.findOne({ email });

        if (!checkUser) return res.status(400).json([{ message: 'User does not exist', type: 'error' }]);

        const isMatch = await bcrypt.compare(password, checkUser.password);
        console.log(isMatch);
        if (!isMatch) return res.status(400).json([{ message: 'Invalid password', type: 'error' }]);


        const payload = {
            user: {
                id: checkUser._id
            }
        }
        console.log(payload);


        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 28800
        }, (err, token) => {
            if (err) throw err;
            res.json(token);
        });




    } catch (err) {
        console.error('Error: ${err.message}');
    }
}

const userProfile = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select('-password').select('-__v').select('-createdAt').select('-updatedAt');
        if (!user) return res.status(400).json({ message: 'User not found', type: 'err' });


        res.json(user);




    } catch (err) {
        console.error('Error: ${err.message}');
    }
}


module.exports = { signupUser, signinUser, userProfile }