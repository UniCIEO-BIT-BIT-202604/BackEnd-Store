import express from 'express';
import dbConection from './config/mongo.config.js';
import userRoutes from './routes/user.routes.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';

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
app.use( '/users', userRoutes );
app.use ('/products', productRouter);
app.use('/category', categoryRouter);

// Lanzo el servidor web
app.listen( 3000, () => {
    console.log( `Server running on http://localhost:3000` );
});