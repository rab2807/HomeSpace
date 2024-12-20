const express = require('express');
const path = require('path');
const cors = require('cors');
const {engine} = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();

// Routers
const startRouter = require('./routes/Start/start.router');
const regiRouter = require('./routes/Registration/regi.router');
const loginRouter = require('./routes/Login/login.router')
const ownerRouter = require('./routes/Owner/owner.router');
const tenantRouter = require('./routes/Tenant/tenant.router');
const houseRouter = require('./routes/House/house.router');
const messageRouter = require('./routes/Message/message.router');

// view engine setup
const helper = require('./helpers/helpers');
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',
    helpers: {
        starString: helper.starString,
        ratingBarHelper: helper.ratingBarHelper,
        concat: helper.concat,
        compare: helper.compare,
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware setup
app.use(cors())
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded());
app.use(express.json());
app.use(cookieParser());

app.use(regiRouter);
app.use(loginRouter);
app.use(startRouter);
app.use(ownerRouter);
app.use(tenantRouter);
app.use(houseRouter);
app.use(messageRouter);

module.exports = app; //added 