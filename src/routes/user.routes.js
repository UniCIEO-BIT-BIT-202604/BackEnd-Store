const { Router } = require( 'express' );
const router = Router();

const { getUsers } = require('../controllers/user.controller.js');


// Definicion de las rutas para los usuarios
router.get( '/', getUsers );


module.exports = router;