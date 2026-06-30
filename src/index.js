import express from 'express';
import cors from 'cors';

import dbConection from './config/mongo.config.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3001;


// Conexion a la base de datos
dbConection();

// Middlewares
app.use( express.json() );      // Habilita la interpretacion JSON
app.use( cors(
    // { origin: 'http://localhost:4200' }
) );

// Endpoint
app.get( '/health', ( req, res ) => {
    res.json({
        msg: 'Sitio funcionando! :)'
    });
} );

// Endpoints agrupados por entidad
app.use( '/api/users', userRoutes );
app.use( '/api/products', productRoutes );
app.use('/api/categories', categoryRoutes );
app.use( '/api/auth', authRoutes );

// Lanzo el servidor web
app.listen( PORT, () => {
    console.log( `Server running on http://localhost:3000` );
});