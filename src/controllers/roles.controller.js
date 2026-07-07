import dbGetRoles from "../services/role.service.js";

const getRoles = ( req, res ) => {

    const roles = dbGetRoles();

    res.json({
        msg: 'Obtiene todos los roles definidos para la aplcacion',
        data: roles
    });
}


export default getRoles;