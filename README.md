# back_postres_proyecto_final
 Backend con express para proyecto CRUD de recetario de postres

 ## Tecnologías Utilizadas

### Backend
- **Express**: Framework de Node.js para el desarrollo del servidor y la lógica de la aplicación.


## Funcionalidades

- **Gestión de Postres**: Permite crear, ver, modificar y eliminar postres, ya sea definitivamente o con la posibilidad de restaurarlo.
- **Autenticación de Usuarios**: Incluye una página de registro e inicio de sesión para usuarios.
- **Roles de Usuario**: Diferencia entre administradores y usuarios estándar. Los administradores tienen acceso a funcionalidades adicionales como es la gestión de usuarios, mientras que un usuario estándar no puede acceder a esa página pero si puede acceder a las páginas de bienvenida, lista de postres y agregar postres.
- **Inicio de sesión**: Diferencia entre los usuarios que han iniciado sesión y los que no. Un usuario que no ha iniciado sesión ve las páginas de bienvenida y la acceder, mientras que los que si han iniciado sesión pueden ver las otras páginas mencionadas en el punto anterior y que dependen también de su rol. Pero además, la página de bienvenida esta personalizada y su contenido varía según rol y según sesión iniciada o no.
- **Gestión de Usuarios (Solo para Administradores)**: Los administradores pueden ver un listado de usuarios, eliminarlos temporalmente y restaurarlos. También tienen la opción de eliminar usuarios de manera definitiva.

