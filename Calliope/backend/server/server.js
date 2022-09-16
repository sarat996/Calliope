const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });
const PORT = process.env.PORT || 5000;
const cors = require("cors");
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}
const app = express();

app.use(express.json({ extended: false }));

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB connected');
    } catch (err) {
        console.log(`ERROR: ${err.message}`);
    }
}

connectDB();

app.use(cors(corsOptions));
app.use('/blogapi/user', require('./routes/userRoutes'));
app.use('/blogapi/blogs', require('./routes/blogRoutes'));

app.listen(PORT, () => console.info(`Server running on ${PORT}`));