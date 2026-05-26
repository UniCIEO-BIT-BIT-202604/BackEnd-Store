import express from 'express';

import dbConection from './config/mongo.config.js';

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();      // Habilita la interpretacion de formatos JSON

// Conexion a la base de datos
dbConection();

// Middlewares
app.use( express.json() );      // Habilita la interpretacion JSON

// Endpoint
app.get( '/health', ( req, res ) => {
    res.json({
        msg: 'Sitio funcionando! :)'
    });
} );

// Endpoints agrupados por entidad
app.use( '/users', userRoutes );
app.use( '/products', productRoutes );

// Lanzo el servidor web
app.listen( 3000, () => {
    console.log( `Server running on http://localhost:3000` );
});