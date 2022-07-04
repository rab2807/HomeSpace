const express = require('express');
const path = require('path')
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

// view engine setup
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware setup
app.use(express.static('public'));



app.get('/', function(req, res) {
    res.render('home', { pre: 'Shit!!', title: 'Cool, huh!', name: "rakib", condition: true, anyArray: [1,2,3] });
});
  
app.listen(PORT, () => console.log(`server is listening at ${PORT}`));
