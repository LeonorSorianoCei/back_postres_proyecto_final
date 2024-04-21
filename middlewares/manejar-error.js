/**
 * @función manejarError 
 * @descripcion // Define una función para manejar errores 
 * @param {Function} next - Siguiente función middleware
 */
export function manejarError(error, req, res, next) {
    console.error(error.message);
    
    if (error.status === 404) {
        console.error('URL NO ENCONTRADA');
    } else if (error.status === 500) {
        console.error('ERROR EN EL SERVIDOR');
    } else {
        next(error);
    }
}
