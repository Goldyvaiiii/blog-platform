require('dotenv').config();

const express = require('express');
const expresslayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routehelpers');
const app = express();
const port = process.env.PORT || 5500;

// Check for required environment variables BEFORE anything else
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    console.error('*********************************************************************************');
    console.error('CRITICAL ERROR: Environment Variables are missing!');
    if (!process.env.MONGODB_URI) console.error('- MONGODB_URI is MISSING');
    if (!process.env.JWT_SECRET) console.error('- JWT_SECRET is MISSING');
    console.error('');
    console.error('ACTION REQUIRED:');
    console.error('1. You MUST add these variables in your RAILWAY or RENDER dashboard.');
    console.error('2. You MUST "Push" your code to GitHub so the hosting service sees the update.');
    console.error('*********************************************************************************');
    process.exit(1);
}

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
}));




app.use(express.static('public'));

// templating engine 

app.use(expresslayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');


app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
});
