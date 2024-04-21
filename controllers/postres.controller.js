import Postre from "../models/postre.js";
import {connect} from "../db/mongo.js";

/** 
 * @controller {postresController} Rutas de Postres
 * Esta ruta maneja las solicitudes relacionadas con los postres.
 * 
 * @route {GET}        /postres                  getAllPostres              Obtener todos los postres
 * @route {POST}       /upload                    createPostre              Crear postre
 * @route {PUT}        /postres/:id               updatePostre              Actualizar un postre
 * @route {DELETE}     /postres/:id              deletePostre              Borrar un postre con softdelete
 * @route {PATCH}      /postres/:id              restorePostre             Restaurar un postre eliminado
 * @route {DELETE}     /postres/:id/forever      deletePostreForever       Eliminar definitivamente un postre
 * 
 */



/** 
 * Modelos de la API
 * 
 * @models {Object} Postre
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

// Conexión a base de datos
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
 * Obtiene todos los postres de la base de datos y los envía como respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const getAllPostres = async (req, res, next) => {

      try {
          /**
           * Busca todos los postres en la base de datos usando el modelo `Postre` y el método `find()`.
           */        
          const postres = await Postre.find();
      
          /**
          * Si no se encuentran postres en la base de datos, se genera un error y se envía una respuesta de error 404.
          */
          if (!postres) {
            const error = new Error('No se encontró la lista de postres');
            error.status = 404;
            console.error(error);
            next(error);
            return res.status(404).json({ error: "No se encontró la lista de postres" });
          }
        
         
         /**
          * Si hay postres se envía una respuesta de éxito 200 con el objeto de postres.
          */
          responseAPI.data = postres;
          responseAPI.msg = "Postres obtenidos con éxito";
          res.status(200).send(responseAPI);
          console.log(responseAPI.msg);

          //throw new Error('Error simulado');

      } catch (error) {
          /**
           * Si se produce un error durante el proceso de obtención de postres, se registra el error en la consola y se envía una respuesta de error 500.
           */
          console.error("Error al obtener postres:", error);
          responseAPI.msg = "Error al obtener postres";
          responseAPI.status = "error";
          error.status = 500;
          res.status(500).json(responseAPI);
          next(error);
      }

};


/**
 * Crea un nuevo postre en la base de datos y lo envía como respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const createPostre = async (req, res, next) => {
   
    try {
        /**
        * Obtiene el ID del usuario del cuerpo de la solicitud.
        */
        const userId = req.body.userId;

        /**
         * Obtiene los datos de nombre, descripción, ingredientes, instrucciones, dificultad y tiempo del cuerpo de la solicitud.
         */
        const { nombre, descripcion, ingredientes, instrucciones, dificultad, tiempo } = req.body;
       
        
        /**
         * Crea un nuevo objeto de postre con los datos obtenidos de la solicitud.
         */
        const nuevoPostre = new Postre({
            nombre,
            imagen : req.file.filename,
            descripcion,
            ingredientes,
            instrucciones,
            dificultad,
            tiempo,
            _idUser: userId
        });

        /**
         * Guarda el nuevo postre en la base de datos usando el método `save()`.
         */
        await nuevoPostre.save();

        /**
        * Si se crea con éxito se envía una respuesta de éxito 200 con el objeto de nuevoPostre.
        */
        responseAPI.data = nuevoPostre;
        responseAPI.msg = "Postre creado exitosamente";
        res.status(200).send(responseAPI);
        console.log(responseAPI.msg);

        //throw new Error('Error simulado');
  
    } catch (error) {
       /**
        * Si se produce un error durante el proceso de creación de postres, se registra el error en la consola y se envía una respuesta de error 500.
        */
        console.error("Error al crear el postre", error);
        responseAPI.msg = "Error al crear el postre";
        responseAPI.status = "error";
        error.status = 500;
        res.status(500).json(responseAPI);
        next(error);
    }

};


/**
 * Actualiza un postre existente en la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const updatePostre = async (req, res, next) => {
    try {
      /**
     * Obtiene el ID del postre del parámetro `id` de la URL.
     */
      const postId = req.params.id; 

      /**
     * Obtiene los datos de nombre, descripción, ingredientes, instrucciones, dificultad y tiempo del cuerpo de la solicitud.
     */
      const { nombre, descripcion, ingredientes, instrucciones, dificultad, tiempo } = req.body;
      
      /**
     * Busca el postre en la base de datos usando el ID obtenido y el modelo `Postre`.
     */
      const postre = await Postre.findById(postId);
  
       /**
     * Si no se encuentra el postre, se genera un error y se envía una respuesta de error 404.
     */
      if (!postre) {
        const error = new Error('No se encontró el postre');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el postre" });
      }
  
      /**
     * Si se encuentra el postre, se actualizan sus propiedades con los datos proporcionados en la solicitud, las propiedades que no se modifican se mantienen como en el original.
     */
      if (nombre) {
        postre.nombre = nombre;
      }

      if (descripcion) {
        postre.descripcion = descripcion;
      }

      if (ingredientes) {
        postre.ingredientes = ingredientes;
      }

      if (instrucciones) {
        postre.instrucciones = instrucciones;
      }

      if (dificultad) {
        postre.dificultad = dificultad;
      }

      if (tiempo) {
        postre.tiempo = tiempo;
      }
  
      
      /**
       * Guarda el postre actualizado en la base de datos usando el método `save()`.
       */
      const postreActualizado = await postre.save();
  
      /**
        * Si se actualiza con éxito se envía una respuesta de éxito 200 con el objeto de postreActualizado.
        */
      responseAPI.data = postreActualizado;
      responseAPI.msg = "Postre actualizado exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');


  } catch (error) {
     /**
      * Si se produce un error durante el proceso de actualización de postres, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al actualizar el postre", error);
      responseAPI.msg = "Error al actualizar el postre";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
 * Elimina permanentemente un postre de la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
  export const deletePostreForever = async (req, res, next) => {
    try {
      /**
     * Obtiene el ID del postre del parámetro `id` de la URL.
     */
      const { id } = req.params; 
      
     /**
     * Busca y elimina el postre de la base de datos usando el modelo `Postre` y el método `findByIdAndDelete`.
     */
      const deletedPostre = await Postre.findByIdAndDelete(id);

     /**
     * Si no se encuentra el postre, se genera un error y se envía una respuesta de error 404.
     */
      if (!deletedPostre) {
        const error = new Error('No se encontró el postre para eliminar');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el postre para eliminar" });
      }
  
      /**
        * Si se elimina con éxito se envía una respuesta de éxito 200 con el objeto de deletedPostre.
        */
      responseAPI.data = deletedPostre;
      responseAPI.msg = "Postre eliminado exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');

    } catch (error) {
      /**
      * Si se produce un error durante el proceso de eliminación de postres, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al eliminar el postre", error);
      responseAPI.msg = "Error al eliminar el postre";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
  * Elimina un postre de manera lógica (marcando un campo como eliminado) de la base de datos y envía la respuesta.
  *
  * @param {Object} req Objeto de solicitud HTTP.
  * @param {Object} res Objeto de respuesta HTTP.
  * @param {Function} next Función de paso al siguiente middleware.
  */
export const deletePostre = async (req, res, next) => {
    try {
      /**
     * Obtiene el ID del postre del parámetro `id` de la URL.
     */
      const { id } = req.params; 

      /**
     * Busca y actualiza el postre en la base de datos usando el modelo `Postre` y el método `findByIdAndUpdate`.
     * - Se utiliza el operador `$set` de MongoDB para establecer el campo `deleted_at` con la fecha actual.
     * - La opción `new: true` se utiliza para devolver el documento actualizado en lugar del original.
     */
      const deletePostre = await Postre.findByIdAndUpdate(id, { $set: { deleted_at: new Date() } }, { new: true });
  
    /**
     * Si no se encuentra el postre, se genera un error y se envía una respuesta de error 404.
     */
      if (!deletePostre) {
        const error = new Error('No se encontró el postre para eliminar');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el postre para eliminar" });
      }

      /**
       * Si se elimina con éxito se envía una respuesta de éxito 200 con el objeto de deletePostre.
       */
      responseAPI.data = deletePostre;
      responseAPI.msg = "Postre eliminado de manera temporal exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');

    } catch (error) {
      /**
      * Si se produce un error durante el proceso de eliminación de postres, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al eliminar de manera temporal el postre", error);
      responseAPI.msg = "Error al eliminar de manera temporal el postre";
      responseAPI.status = "error";
      error.status = 500;
      res.status(500).json(responseAPI);
      next(error);
    }
  };


/**
 * Restaura un postre previamente eliminado lógicamente (marcado como eliminado) en la base de datos y envía la respuesta.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const restorePostre = async (req, res, next) => {
    try {
      /**
       * Obtiene el ID del postre del parámetro `id` de la URL.
       */
      const { id } = req.params; 
      
      /**
       * Busca y actualiza el postre en la base de datos usando el modelo `Postre` y el método `findByIdAndUpdate`.
       * - Se utiliza el operador `$set` de MongoDB para establecer el campo `deleted_at` a `null`, indicando que ya no está eliminado.
       * - La opción `new: true` se utiliza para devolver el documento actualizado en lugar del original.
       */
      const restoredPostre = await Postre.findByIdAndUpdate(id, { $set: { deleted_at: null } }, { new: true });

      /**
       * Si no se encuentra el postre, se genera un error y se envía una respuesta de error 404.
       */
      if (!restoredPostre) {
        const error = new Error('No se encontró el postre para restaurar');
        error.status = 404;
        console.error(error);
        next(error);
        return res.status(404).json({ error: "No se encontró el postre para restaurar" });
      }
      
      /**
       * Si se restaura con éxito se envía una respuesta de éxito 200 con el objeto de restoredPostre.
       */
      responseAPI.data = restoredPostre;
      responseAPI.msg = "Postre restaurado exitosamente";
      res.status(200).send(responseAPI);
      console.log(responseAPI.msg);

      //throw new Error('Error simulado');

    } catch (error) {
      /**
      * Si se produce un error durante el proceso de restauración de postres, se registra el error en la consola y se envía una respuesta de error 500.
      */
      console.error("Error al restaurar el postre", error);
      responseAPI.msg = "Error al restaurar el postre";
      responseAPI.status = "error";
      res.status(500).json(responseAPI);
      next(error);
    }
  };