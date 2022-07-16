const express = require('express');
const path = require('path');
const cors = require('cors');
const {engine} = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Routers
const startRouter = require('./routes/Start/start.router');
const regiRouter = require('./routes/Registration/regi.router');
const ownerRouter = require('./routes/Owner/owner.router');
const tenantRouter = require('./routes/Tenant/tenant.main.router');
const houseRouter = require('./routes/House/house.router');

// view engine setup
app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/layouts',

    helpers: {
        starString: (value) => {
            let str = "";
            for (let i = 0; i < value; i++)
                str = str.concat('<i class="fas fa-star"></i>');
            for (let i = 0; i < 5 - value; i++)
                str = str.concat('<i class="far fa-star"></i>');
            return str;
        },

        ratingBarHelper: (arr) => {
            /*
                        <tr>
                            <td>
                                <label htmlFor="rating">5<i className="fas fa-star"></i> ({{count_5}})</label>
                            </td>
                            <td style="padding-left: 10px">
                                <progress value={{count_5}} max={{maxVal}}></progress>
                            </td>
                        </tr>
            */
            let str = ``;
            let sum = arr.reduce((t, n) => t += n, 0);
            for (let i = 0; i < 5; i++) {
                str = str.concat(`<tr><td><label for="rating">${(5 - i)}<i class="fas fa-star"></i>(${arr[i]})</label></td>` +
                    `<td style="padding-left: 10px"><progress value=${arr[i]} max=${sum}></progress></td></tr>`);
            }
            return str;
        },
        concat: (val1, val2) => {
            return val1.concat(val2);
        },
        compare: (val1, val2, comp) => {
            if (comp === '=') return val1 === val2;
            else if (comp === '>') return val1 > val2;
            else return val1 < val2;
        },
    }
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware setup
app.use(cors())
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded());
app.use(express.json());

app.use(regiRouter);
app.use(startRouter);
app.use(ownerRouter);
app.use(tenantRouter);
app.use(houseRouter);

// app.get('/', function(req, res) {
//     res.render('home', { pre: 'Shit!!', title: 'Cool, huh!', name: "rakib", condition: true, anyArray: [1,2,3] });
// });

app.listen(PORT, () => console.log(`server is listening at ${PORT}`));
