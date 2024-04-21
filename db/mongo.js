// Importa el módulo mongoose para la conexión a la base de datos MongoDB
import mongoose from 'mongoose';
/**
 * @función connect 
 * @descripcion // Define una función asíncrona llamada `connect` para establecer la conexión
 * * @param {string} DB_URL - La URL de la base de datos MongoDB, obtenida de una variable de entorno
 */
export const connect = async() =>{
    
    // Obtiene la URL de la base de datos desde la variable de entorno `DB_URL`
    const DB_URL = process.env.DB

    // Intenta conectarse a la base de datos MongoDB utilizando la URL obtenida, si se logra manda un mensaje de éxito, si no de error.
    await mongoose.connect(process.env.DB_URL)
    .then(()=> console.log("Connectado a MongoDB Atlas ONLINE"))
    .catch(e=> console.log("Error en la conexion", e));
}
