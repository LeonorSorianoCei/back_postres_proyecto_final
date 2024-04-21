import Usuario from "../models/usuario.js";
import {connect} from "../db/mongo.js";

/** 
 * @controller {userController} Rutas de Usuarios
 * Esta ruta maneja las solicitudes relacionadas con los usuarios.
 * 
 * @route {GET}        /usuarios                  getAllUsers             Obtener todos los usuarios
 * @route {DELETE}     /usuarios/:id              deleteUser              Borrar un usuario con softdelete
 * @route {PATCH}      /usuarios/:id              restoreUser             Restaurar un usuario eliminado
 * @route {DELETE}     /usuarios/:id/forever      deleteUserForever       Eliminar definitivamente un postre
 * 
 */


/** 
 * Modelos de la API
 * 
 * @models {Object} Usuario
 * 
 */


/** 
 * Manejo de errores
 * 
 * Para comprobar el manejo de errores se crea un nuevo error añadiendo esta línea a cada controller:
 * //throw new Error('Error simulado');
 * Descomentando esta línea y comentando las siguientes, se puede comprobar el funcionamiento ante posibles errores.
 * Comentar estas líneas:
 * res.status(200).send(responseAPI);
 * console.log(responseAPI.msg);
 * 
 */

//conectar a base de datos
connect();

/**
 * @object responseAPI
 * @descripcion Objeto que define el formato de respuesta de la API
 * @property {Array} data - Contiene los datos de la respuesta
 * @property {string} msg - Mensaje de la respuesta
 * @property {string} status - Estado de la respuesta, por ejemplo "ok"
 */
const responseAPI = {
    data: [],
    msg: "",
    status: "ok"
}


/**
  * Elimina un usuario de manera lógica (marcando un campo como eliminado) de la base de datos y envía la respuesta.
  *
  * @param {Object} req Objeto de solicitud HTTP.
  * @param {Object} res Objeto de respuesta HTTP.
  * @param {Function} next Función de paso al siguiente middleware.
  */
export const deleteUser = async (req, res, next) => {
    try {
    /**
     * Obtiene el ID del usuario del parámetro `id` de la URL.
     */
      const { id } = req.params; 

      /**
     * Busca y actualiza el usuario en la base de datos usando el modelo `Usuario` y el método `findByIdAndUpdate`.
     * - Se utiliza el operador `$set` de MongoDB para establecer el campo `deleted_at` con la fecha actual (`new Date()`).
     * - La opción `new: true` se utiliza para devolver el documento actualizado en lugar del original.
     */
      const deleteUser = await Usuario.findByIdAndUpdate(id, { $set: { deleted_at: new Date() } }, { new: true });

       /**
     * Si no se encuentra el usuario, se genera un error y se envía una respuesta de error 404.
     */
      if (!deleteUser) {
        const error = new Error('No se encontró el usuario para eliminar');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el usuario para eliminar" });
      }

       /**
       * Si se elimina con éxito se envía una respuesta de éxito 200 con el objeto de deleteUser.
       */
      responseAPI.data = deleteUser;
      responseAPI.msg = "Usuario eliminado de manera temporal exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');

    } catch (error) {
      /**
      * Si se produce un error durante el proceso de eliminacióñ de usuarios, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al eliminar de manera temporal usuario:", error);
      responseAPI.msg = "Error al eliminar de manera temporal el usuario";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
 * Restaura un usuario previamente eliminado lógicamente (marcado como eliminado) en la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const restoreUser = async (req, res, next) => {
    try {
     /**
      * Obtiene el ID del usuario del parámetro `id` de la URL.
      */
      const { id } = req.params; 
      
      /**
       * Busca y actualiza el usuario en la base de datos usando el modelo `Usuario` y el método `findByIdAndUpdate`.
       * - Se utiliza el operador `$set` de MongoDB para establecer el campo `deleted_at` a `null`, indicando que ya no está eliminado.
       * - La opción `new: true` se utiliza para devolver el documento actualizado en lugar del original.
       */
      const restoredUser = await Usuario.findByIdAndUpdate(id, { $set: { deleted_at: null } }, { new: true });
 
     /**
      * Si no se encuentra el usuario, se genera un error y se envía una respuesta de error 404.
      */
      if (!restoredUser) {
        const error = new Error('No se encontró el usuario para restaurar');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el usuario para restaurar" });
      }

      /**
       * Si se restaura con éxito se envía una respuesta de éxito 200 con el objeto de restoredUser.
       */
      responseAPI.data = restoredUser;
      responseAPI.msg = "Usuario restaurado exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');

    } catch (error) {
       /**
      * Si se produce un error durante el proceso de restauración de usuarios, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al restaurar usuario:", error);
      responseAPI.msg = "Error al restaurar el usuario";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
 * Elimina permanentemente un usuario de la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const deleteUserForever = async (req, res, next) => {
    try {
     /**
      * Obtiene el ID del usuario del parámetro `id` de la URL.
      */
      const { id } = req.params; 

      /**
      * Busca y elimina el usuario de la base de datos usando el modelo `Usuario` y el método `findByIdAndDelete`.
      */
      const deletedUser = await Usuario.findByIdAndDelete(id);
      
      /**
       * Si no se encuentra el usuario, se genera un error y se envía una respuesta de error 404.
       */
      if (!deletedUser) {
        const error = new Error('No se encontró el usuario para eliminar para siempre');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el usuario para eliminar para siempre" });
      }

      /**
       * Si se elimina con éxito se envía una respuesta de éxito 200 con el objeto de deletedUser.
       */
      responseAPI.data = deletedUser;
      responseAPI.msg = "Usuario eliminado exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');
    
    } catch (error) {
       /**
      * Si se produce un error durante el proceso de eliminación de usuarios, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al eliminar usuario:", error);
      responseAPI.msg = "Error al eliminar el usuario";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
 * Obtiene todos los usuarios de la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
*/
export const getAllUsers = async (req, res, next) => {
     
    try {
         /**
          * Busca todos los usuarios en la base de datos usando el modelo `Usuario` y el método `find`.
          */
        const usuarios = await Usuario.find();
        
         /**
          * Si no se encuentran usuarios, se genera un error y se envía una respuesta de error 404.
          */
        if (!usuarios) {
          const error = new Error('No hay usuarios');
          error.status = 404;
          console.error(error);
          next(error);
          return res.status(404).json({ error: "No hay usuarios" });
        }

         /**
       * Si se obtienen con éxito se envía una respuesta de éxito 200 con el objeto de usuarios.
       */
        responseAPI.data = usuarios;
        responseAPI.msg = "Obtener usuarios";
        res.status(200).send(responseAPI);

        //throw new Error('Error simulado');
        
      } catch (error) {
         /**
      * Si se produce un error durante el proceso de obtención de usuarios, se registra el error en la consola y se envía una respuesta de error 500.
      */
        console.error("Error al obtener usuarios:", error);
        responseAPI.msg = "Error al obtener usuarios";
        responseAPI.status = "error";
        res.status(500).send(responseAPI);
         next(error);
      }
}
