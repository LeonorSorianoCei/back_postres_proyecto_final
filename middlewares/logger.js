/**
 * @función logger
 * @descripcion Middleware para registrar información sobre la solicitud
 * @param {Object} req - Objeto de solicitud
 * @param {Object} res - Objeto de respuesta
 * @param {Function} next - Siguiente función middleware
 */
export const logger = (req, res, next) => {
  /**
   * Registra información sobre la solicitud en la consola
   */
    console.log("Registro guardado, ruta:", req.originalUrl)
    console.log("Time", Date.now())

    /**
   * Pasa el control al siguiente middleware en la cadena
   */
    next()
}