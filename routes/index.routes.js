import { Router } from "express";
import { getAllPostres, createPostre, updatePostre, deletePostre, restorePostre, deletePostreForever } from "../controllers/postres.controller.js";
import multer from 'multer'
import express from "express";
import { getAllUsers, deleteUser, restoreUser, deleteUserForever } from "../controllers/user.controller.js";
import { createUser, loginUser } from "../controllers/auth.controller.js";
import { storage } from "../multer/multer.js";


/*
 * Ruta principal de la API (indexRoutes)
 * Esta ruta maneja las solicitudes a la API.
 *
 * @controller {postres.controller}
 * @controller {user.controller}
 * @controller {auth.controller}
 * @route {GET} / Recupera una lista de todos los datos
 * @route {POST} / Agrega los datos recibidos en el cuerpo
 * @route {PUT} / Actualiza los datos recibidos en el cuerpo
 * @route {PATCH} / Actualiza parte de los datos recibidos en el cuerpo
 * @route {DELETE} / Elimina un dato
 */

/**
 * @object upload
 * @descripcion Crea un objeto de configuración para el almacenamiento de archivos con Multer
 */
const upload = multer({ storage })

/**
* @object router
 * @descripcion Crea un enrutador de Express para manejar las rutas de la aplicación
 * @param {Object} express.Router - Módulo de enrutamiento de Express 
 */
const router = Router();


/**
 * @description Ruta para servir los archivos de imágenes subidos
 * 
 * Este middleware utiliza el middleware `express.static()` para servir los archivos de imágenes
 * ubicados en el directorio 'uploads' de la aplicación. Cualquier solicitud a la ruta '/files'
 * servirá los archivos estáticos de ese directorio.
 */
router.use('/files', express.static('uploads'));


//POSTRES
// Obtener todos los postres
router.get("/postres", getAllPostres);

// Crear un nuevo postre
router.post("/postres/crear", upload.single('imagen_subida'), createPostre);

// Actualizar un postre
router.put("/postres/:id", updatePostre); 

// borrar un postre con softdelete
router.delete("/postres/:id", deletePostre); 

// Ruta para restaurar un postre eliminado
router.patch("/postres/:id", restorePostre);

// Ruta para eliminar definitivamente un postre
router.delete("/postres/:id/forever", deletePostreForever);




// AUTH
// Crear un nuevo usuario para el registro
router.post("/create/user", upload.single('imagen_usuario'), createUser);

// iniciar sesion 
router.post("/login/user", loginUser);




//USUARIOS
// Obtener todos los usuarios
router.get("/usuarios", getAllUsers);

// borrar un usuario con softdelete
router.delete("/usuarios/:id", deleteUser); 

// Ruta para restaurar un usuario eliminado
router.patch("/usuarios/:id", restoreUser);

// Ruta para eliminar definitivamente un usuario
router.delete("/usuarios/:id/forever", deleteUserForever);

export default router;
