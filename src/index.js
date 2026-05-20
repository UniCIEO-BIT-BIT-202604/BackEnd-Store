const express = require( 'express' );

const app = express();

// Endpoint
app.get( '/health', ( req, res ) => {
    res.json({
        msg: 'Sitio funcionando! :)'
    });
} );

// Lanzo el servidor web
app.listen( 3000, () => {
    console.log( `Server running on http://localhost:3000` );
});