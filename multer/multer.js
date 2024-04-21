import multer from 'multer'

/**
 * @object storage
 * @descripcion Crea un objeto de configuración para el almacenamiento de archivos con Multer
 * @param {Object} multer - Módulo Multer para el manejo de archivos
 * 
 * @propiedad destination - Define la función para determinar la carpeta de destino de los archivos subidos
 *   @param {Object} req - Objeto de solicitud
 *   @param {Object} file - Objeto de archivo subido
 *   @param {Function} cb - Función de callback para indicar la carpeta de destino
 * 
 * @propiedad filename - Define la función para determinar el nombre del archivo almacenado
 *   @param {Object} req - Objeto de solicitud
 *   @param {Object} file - Objeto de archivo subido
 *   @param {Function} cb - Función de callback para indicar el nombre del archivo
 */
export const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`)
    }
})