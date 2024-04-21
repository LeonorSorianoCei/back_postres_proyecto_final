import mongoose from "mongoose";

/** 
 * Modelo de Usuario
 * Este modelo define la estructura y comportamiento de los registros
 * de usuarios en la base de datos.
 * @model Usuario
 * @property {string} nombre - Nombre del usuario.
 * @property {string} clave - Clave de acceso del usuario.
 * @property {string} imagen - URL de la imagen del usuario.
 * @property {Date} created_at - Fecha y hora de creación del usuario.
 * @property {Date} updated_at - Fecha y hora de última actualización del usuario.
 * @property {string} descripcion - Descripción del usuario.
 * @property {Date} deleted_at - Fecha y hora de eliminación del usuario.
 * @property {boolean} isAdmin - Indica si el usuario es administrador.
 * @property {boolean} isLogged - Indica si el usuario está logueado.
 */

const usuarioSchema = new mongoose.Schema({
    nombre: String,
    clave: String,
    imagen: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    descripcion: String,
    deleted_at: {
        type: Date,
        default: null
    },
    isAdmin: Boolean,
    isLogged: Boolean
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

export default Usuario;
