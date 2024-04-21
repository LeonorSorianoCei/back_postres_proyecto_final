// Importa la biblioteca dotenv para cargar variables de entorno desde un archivo .env
import dotenv from 'dotenv';

// Configura dotenv para leer el archivo .env en el directorio actual
dotenv.config();

// Define el puerto para el servidor
export const PORT = process.env.PORT || 3000;

    // Comprueba si la variable de entorno PORT está configurada
    // Si lo está, usa ese valor. En caso contrario, usa el valor predeterminado de 3000
  
// Define el dominio para el servidor
export const DOMAIN = process.env.DOMAIN || "http://localhost";

    // Comprueba si la variable de entorno DOMAIN está configurada
    // Si lo está, usa ese valor. En caso contrario, usa el valor predeterminado de "http://localhost"

// Combina el dominio y el puerto para crear la URL del dominio completo
export const FULLDOMAIN = `${DOMAIN}:${PORT}`;