function getUsers ( req, res ) {
    res.json({
        msg: 'Listar todos los usuarios'
    });
}

module.exports = {
    getUsers
};