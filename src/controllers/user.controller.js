function getUsers ( req, res ) {
    res.json({
        msg: 'Listar todos los usuarios'
    });
}

function createUser( req, res ) {
    res.json({
        msg: 'Crea un usuario'
    });
}

function updateUser( req, res ) {
    res.json({
        msg: 'Actualiza un usuario'
    });
}

function deleteUser( req, res ) {
    res.json({
        msg: 'Elimina un usuario'
    });
}


module.exports = {
    getUsers,
    createUser,
    updateUser,
    deleteUser
};