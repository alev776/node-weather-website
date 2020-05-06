const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geocode = require('./utils/geocode');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for Express config//

//path.join acepta dos parametros, el primero el dirname que te dice en que folder esta el actual documento que estas usando,
// y el segundo parametro es para manipular el string, o sea para que vaya a una ruta determinada
const publicDirectory = path.join(__dirname, '../public');

const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');


//Setup handlerbars engine views location//

app.set('views', viewPath);

//tiene que ser con el mismo nombre ya que instalamos la libreria hbs
app.set('view engine', 'hbs');
hbs.registerPartials(partialsPath);

// Setup static directory to serve //

//esto lo que hace es que el archivo index.html sera lo que se mostrara por default en la pagina.
app.use(express.static(publicDirectory));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app',
        name: 'Alex'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Johny Sins'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help page',
        name: 'Helvergon'
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Address must be provided'
        });
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error
            });
        }
        forecast(latitude, longitude, (error, data) => {
            if (error) {
                return res.send({
                    error
                });
            }
            res.send({
                forecast: data,
                location,
                address: req.query.address
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search);
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alex',
        errorMessage: 'Help article not found'
    });
});

app.get('/weather/*', (req, res) => {
    res.send('Weather article not found');
});

app.get('/about/*', (req, res) => {
    res.send('about article not found');
});

//al poner * es que todos los endpoints son un match y se dispara este get
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Alex',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log('Server is up on port 3000');
});