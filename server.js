const express = require('express');
const path = require('path');
const cors = require('cors');
const { engine } = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Routers
const startRouter = require('./routes/Start/start.router');
const ownerRegiRouter = require('./routes/OwnerRegi/ownerRegi.router');

// view engine setup
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware setup
app.use(cors())
app.use(express.static('public'));
app.use(express.json());

app.use(startRouter);
app.use(ownerRegiRouter);

// app.get('/', function(req, res) {
//     res.render('home', { pre: 'Shit!!', title: 'Cool, huh!', name: "rakib", condition: true, anyArray: [1,2,3] });
// });
  
app.listen(PORT, () => console.log(`server is listening at ${PORT}`));
