const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();


require('dotenv').config();




app.use(cors())
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log('MongoDB connected successfully!');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});


app.get("/", (req, res) => {
    res.send("Fake Instagram Server");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api", authRoutes);




const sslOptions = {
    key: fs.readFileSync(path.resolve(__dirname, 'server.key')), 
    cert: fs.readFileSync(path.resolve(__dirname, 'server.cert')) 
};

https.createServer(sslOptions, app).listen(process.env.PORT, () => {
    console.log('HTTPS Server is running on port ' + process.env.PORT);
});


