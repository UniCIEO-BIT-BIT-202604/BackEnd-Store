import express, { application } from 'express';

import dbConection from './config/mongo.config.js';
import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/category.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// Conexion a la base de datos
dbConection();


//middlewares
app.use(express.json());


// Endpoint
app.get( '/health', ( req, res ) => {
    res.json({
        msg: 'Sitio funcionando! :)'
    });
} );

// Endpoints agrupados por entidad
app.use( '/api/users', userRoutes );
app.use ('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use( '/api/auth', authRoutes );

// Lanzo el servidor web
app.listen( 3000, () => {
    console.log( `Server running on http://localhost:3000` );
});