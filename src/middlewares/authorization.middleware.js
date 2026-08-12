// Definicion de un 'Closure', que no es mas que una funcione que retorna otra funcion
const authorizationUser = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      // Paso 1: Extrae el rol del req.body
      const { role } = req.payload; // Desestructuration (ES2015)

      // Verifica hay un valor en role
      if (!role) {
        // Nosotros estamos definiendo manualmente una exception
        throw new Error("No tiene los permisos definidos");
      }

      // Paso 2: Verificar si el rol del usuario  esta en la lista de roles permitidos
      if (!allowedRoles.includes(role)) {
        return res.status(403).json({
          msg: `El rol ${role} no esta autorizado para esta acción`,
        });
      }

      console.log(`El rol ${role} está autorizado para esta acción`);

      // Paso 3: Da acceso a la ejecucion de la siguiente funcion definida en la ruta
      next();
    } catch (error) {
      // A. Capturar error definido en cuerpo del try/catch
      if (error.message.includes("No tiene los permisos definidos")) {
        return res.status(404).json({
          msg: error.message,
        });
      }

      console.error(error);

      // Respuesta generica de la exception
      res.status(500).json({
        msg: "Error de autorización del servidor",
      });
    }
  };
};

export default authorizationUser;

