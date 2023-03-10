const express = require('express');
const app = express();
const PORT = 5000;
const bodyParser = require('body-parser');
const cors = require("cors")
const cookieParser = require('cookie-parser')
require('./database')

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(cookieParser())

const blogRoute = require('./routes/blogs');
app.use('/api/blogs', blogRoute);
const registrationRoute = require('./routes/registration');
app.use('/api/register', registrationRoute);
const loginRoute = require('./routes/login');
app.use('/api/login', loginRoute);
const verifyRoute = require('./routes/verify');
app.use('/api/verify', verifyRoute);

app.listen(PORT, () => {
    console.log(`Server is now listening on PORT ${PORT}.`);
});