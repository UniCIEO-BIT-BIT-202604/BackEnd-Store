const removeRole = (req, res, next) => {
    const inputData = req.body;

    delete inputData.role;
    delete inputData.status;

    next();
}


export {
    removeRole
}