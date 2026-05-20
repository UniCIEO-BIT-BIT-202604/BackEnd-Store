const { Router } = require( 'express' );
const router = Router();

const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/user.controller.js');


// Definicion de las rutas para los usuarios
router.get( '/', getUsers );
router.post( '/', createUser );
router.patch( '/', updateUser );
router.delete( '/', deleteUser );


module.exports = router;