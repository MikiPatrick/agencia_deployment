// importar express
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')
const routes = require('./routes');

const configs = require('./config');

// Lo copiamos y lo llevamos a Viajes.js
const db = require('./config/database');

require('dotenv').config({ path: 'variables.env' })

// Verificamos la conexion
db.authenticate()
     .then(() => console.log('DB Conectada'))
     .catch(error => console.log(error));

// configuracion express
const app = express();

// Habilitar pug
app.set('view engine', 'pug');

// Añadir las vistas
app.set('views', path.join(__dirname, './views'));

// cargar una carpeta estatica llamada public
app.use(express.static('public'));

// Validar si estamos en desarollo o en Prod
const config = configs[app.get('env')];

// creamos la variable para le sitio web
app.locals.titulo = config.nombresitio;


// Muestra el año actual y generar la ruta
app.use((req, res, next) => {
     // crear una  nueva fecha
     const fecha = new Date();
     res.locals.fechaActual = fecha.getFullYear();
     // console.log(res.locals);
     res.locals.ruta = req.path; 
    // console.log(res.locals);
     return next();
})
// ejecutamos el bodyparser
app.use(bodyParser.urlencoded({extended: '1' }));


// cargar las rutas
app.use('/', routes() );

/** Puerto y host para la app, asignamos puerto en caso no existe 0.0.0.0 que no es valido pero heroku la asignara */
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
     console.log('El servidor esta funcionando');
} );
