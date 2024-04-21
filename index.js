import express from "express";
import {PORT, FULLDOMAIN} from "./config/config.js"
import { logger } from "./middlewares/logger.js";
import { setHeaders } from "./middlewares/set-headers.js";
import {manejarError} from "./middlewares/manejar-error.js";
import indexRoutes from "./routes/index.routes.js";
import cors from 'cors'



/*————————————————————————————————————————*\
 * Express API
 * Nos conectamos a la base de datos de postresData para devolver la información
 *
 * @middlewares {cors, setHeaders, logger, express.json(), express.urlencoded()}
 * @routes {Express Router}
 * @model {mongoose}
 * @endpoint {/} {GET}
 * @endpoint {/API/v1/} {get, post, put, patch, delete}
 * @endpoint {/url/:param} {get, post, put, patch, delete}
 ————————————————————————————————————————*/


const app = express()           //crea una instancia de la aplicación Express utilizando la función express()
console.clear();                // Limpia la consola antes de iniciar la aplicación

//middlewares
app.use(cors())                 // Habilita CORS para permitir solicitudes de diferentes orígenes        
app.use(setHeaders)             //Aplica middleware personalizado para establecer cabeceras de respuesta     
app.use(express.json());        // Parsear solicitudes JSON entrantes   
app.use(logger)                 // Aplica middleware personalizado para loggear información de las peticiones
app.use(express.urlencoded({extended:true}))         //configura el middleware express.urlencoded para parsear solicitudes con formato URL-encoded.

//rutas
app.get("/", (req, res) => {
    res.setHeader("Content-type", "text/html"); // Establece el tipo de contenido de la respuesta como HTML

    const landingHTML = `
    <h1>Bienvenidos a nuestra API de Postres!!</h1>
    `
    res.send(landingHTML); // Envía la página de bienvenida
})

app.use("/API/v1/", indexRoutes)  // Monta las rutas definidas en index.routes.js bajo el prefijo "/API/v1/"



// Middleware para errores

app.use((req, res, next) => {
    const error = new Error('Página no encontrada');
    error.status = 404;
    next(error);
    return res.status(404).json({ error: "Página no encontrada" });
});

app.use(manejarError);


//iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on ${FULLDOMAIN}`)
})
