/**
 * @función manejarError 
 * @descripcion // Define una función para manejar errores 
 * @param {Function} next - Siguiente función middleware
 */
export const setHeaders = (req, res, next) => {

    res.setHeader("Content-type", "application/json")
    next()
}