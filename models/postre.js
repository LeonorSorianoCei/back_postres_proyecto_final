import mongoose from "mongoose";


/** 
 * Modelo de Postre
 * Este modelo define la estructura y comportamiento de los registros
 * de postres en la base de datos.
 * @model Postre
 * @property {string} nombre - Nombre del postre.
 * @property {string} imagen - URL de la imagen del postre.
 * @property {string} descripcion - Descripción del postre.
 * @property {string} ingredientes - Ingredientes del postre.
 * @property {string} instrucciones - Instrucciones para preparar el postre.
 * @property {string} dificultad - Nivel de dificultad del postre.
 * @property {string} tiempo - Tiempo de preparación del postre.
 * @property {ObjectId} _idUser - ID del usuario que creó el postre.
 * @property {Date} create_at - Fecha y hora de creación del postre.
 * @property {Date} updated_at - Fecha y hora de última actualización del postre.
 * @property {Date} deleted_at - Fecha y hora de eliminación del postre.
 */

const postreSchema = ({
    nombre: String,
    imagen: String,
    descripcion: String,
    ingredientes: String,
    instrucciones: String,
    dificultad: String,
    tiempo: String,
    _idUser: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario' 
    },
    create_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    deleted_at: {
        type: Date,
        default: null
    }
});

const Postre = mongoose.model("Postre", postreSchema);

export default Postre;
