import Usuario from "../models/usuario.js";
import {connect} from "../db/mongo.js";
import bcrypt from 'bcrypt'

/** 
 * @controller {userController} Rutas de autentificación.
 * Esta ruta maneja las solicitudes relacionadas con la autentificación.
 * 
 * @route {POST}       /create/user               createUser               Crear un nuevo usuario       
 * @route {POST}       /login/user                loginUser               Iniciar sesion
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
  * Inicio de sesión del usuario.
  *
  * @param {Object} req Objeto de solicitud HTTP.
  * @param {Object} res Objeto de respuesta HTTP.
  * @param {Function} next Función de paso al siguiente middleware.
  */
export const loginUser = async (req, res, next) => {

    try {
        //throw new Error('Error simulado');

        /**
        * Obtiene los datos de nombre de usuario y contraseña del cuerpo de la solicitud.
        */
        const { clave, nombre } = req.body;

        /**
        * Busca el usuario en la base de datos con el nombre de usuario proporcionado.
        */
        const usuario = await Usuario.findOne({ nombre: nombre });

        /**
        * Si no se encuentra el usuario, se genera un error y se envía una respuesta de error 404.
        */
        if (!usuario) {
          const error = new Error('¡Error, inténtalo de nuevo!');
          error.status = 404;
          console.error(error);
          next(error);
          return res.status(404).json({ error: "¡Error, inténtalo de nuevo!" });
        }
 
        /**
        * Si se encuentra el usuario, se compara la contraseña proporcionada con la contraseña almacenada en la base de datos usando bcrypt.compareSync.
        */
        if (usuario && bcrypt.compareSync(clave, usuario.clave)) {
          /**
          * Si la contraseña coincide, se actualiza el estado `isLogged` del usuario a `true` y se guarda el usuario en la base de datos.
          */
          usuario.isLogged = true;
          await usuario.save();

          /**
          * Se elimina la propiedad `clave` del objeto de usuario antes de enviarlo como respuesta para evitar exponer la contraseña.
          */
          delete usuario.clave; 

          /**
          * Se almacena el objeto de usuario en la propiedad `req.usuario` para facilitar el acceso a los datos del usuario en las siguientes solicitudes.
          */
          req.usuario = usuario;

          /**
          * Se envía una respuesta de éxito 200 con el objeto de usuario.
          */
          res.status(200).json({ usuario });
          responseAPI.msg = "Inicio de sesión correcto";
          console.log(responseAPI.msg);
        }else {
          /**
           * Si la contraseña no coincide, se genera un error y se envía una respuesta de error 401.
           */
          const error = new Error('Inicio de sesión incorrecto');
          error.status = 401;
          console.error(error);
          next(error);
          return res.status(401).json({ error: "Inicio de sesión incorrecto" });
        } 

    } catch (error) {
    /**
     * Si se produce un error durante el proceso de inicio de sesión, se registra el error en la consola y se envía una respuesta de error 500.
     */
        console.error("Inicio de sesión incorrecto:", error);
        responseAPI.msg = "Inicio de sesión incorrecto";
        responseAPI.status = "error";
        error.status = 500;
        res.status(500).json(responseAPI);
        next(error); 
      }
};





/**
 * Crear un nuevo usuario en la base de datos.
 *
 * @param {Object} req Objeto de solicitud HTTP.
 * @param {Object} res Objeto de respuesta HTTP.
 * @param {Function} next Función de paso al siguiente middleware.
 */
export const createUser = async (req, res, next) => {
    try {
      /**
       * Obtiene los datos de nombre, contraseña y descripción del cuerpo de la solicitud.
       */
        const { nombre, clave, descripcion } = req.body

      /**
       * Verifica si ya existe un usuario con el mismo nombre.
       */
        const existingUser = await Usuario.findOne({ nombre });

    
      /**
       * Si ya existe un usuario con el mismo nombre, se genera un error y se envía una respuesta de error 404.
       */
        if (existingUser) {
          const error = new Error('prueba con otras credenciales');
          error.status = 404;
          console.error(error);
          next(error);
          return res.status(404).json({ error: "prueba con otras credenciales" });
        }

        /**
        * Encripta la contraseña proporcionada usando bcrypt.hashSync.
        */
        const claveEncriptada = bcrypt.hashSync(clave, 10)
       
        /**
        * Crea un nuevo objeto de usuario con los datos obtenidos de la solicitud.
        */
        const nuevoUsuario = new Usuario({
            nombre,
            clave: claveEncriptada,
            imagen: req.file.filename,
            descripcion,
            isAdmin : false,
            isLogged : false,
        });

        /**
        * Guarda el nuevo usuario en la base de datos usando el método `save()`.
        */
        await nuevoUsuario.save();

        /**
        * Elimina la propiedad `clave` del objeto de usuario antes de enviarlo como respuesta para evitar exponer la contraseña.
        */
        delete nuevoUsuario.clave;

        /**
        * Se envía una respuesta de éxito 200 con el objeto de nuevoUsuario.
        */
        responseAPI.data = nuevoUsuario;
        responseAPI.msg = "Usuario creado con éxito";
        responseAPI.status = "ok";
        res.status(200).json(responseAPI);
        console.log(responseAPI.msg);

        //throw new Error('Error simulado');
    
    } catch (error) {
       /**
        * Si se produce un error durante el proceso de creación del usuario, se registra el error en la consola y se envía una respuesta de error 500.
        */
        console.error("Error al crear usuario:", error);
        responseAPI.msg = "Error al crear usuario";
        responseAPI.status = "error";
        error.status = 500;
        res.status(500).json(responseAPI);
        next(error);
    }
}
