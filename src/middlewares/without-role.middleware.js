const removeRole = ( req, res, next ) => {
    const inputData = req.body;

    delete inputData.role;

    next();
}


export {
    removeRole
}