# Red-Social

Red social interactiva con estilo Blog.

# Red Social Interactiva.

El desarrollo complementa funcionabilidades reactivas y asincronas, sección para registrarse y loguearse, tiene validaciones básicas - intermedias para registro y login. Un usuario puede crear Publicaciones Multimedia, donde otros usuarios pueden solo leerla, ver detalles de la publicación, quien lo publicó y en que fecha lo hizo, los usuarios no propietarios pueden agregar un comentario a la publicación, el mismo se puede actualizar y eliminar. Pero solo el propietario de la publicación puede actualizarla ó eliminarla, al momento de eliminar la publicación, se eliminará los comentarios de otros usuarios. 


Para cada cuenta de usuario puede, actualizar los datos de información personal de su perfil, modificar una nueva foto del mismo. Puede modificar su contraseña, contiene una serie de validaciones para ello, y por último puede eliminar la cuenta por completo con sus comentarios hechos en otras publicaciones y amigos relacionados.

Un usuario puede mandar solicitudes de amistad a otros usuarios regisrados en la aplicación, esto con el fin de relacionar los amigos dentro de la plataforma. Se pueden listar todos los usuarios regisrados de la red social, poder buscar por nombre, enviar solicitud, cancelar solicitud, listado de solicitudes recibidas con acciones de aprobar o eliminar. En caso de eliminar una solicitud se puede volver a enviar otra al mismo usuario, o el mismo usuario mandar otra solicitud.

# Iniciar Red Social.

Comandos.

FrontEnd: Colocar npm run dev para ejecutar Webpack.
BackEnd: Colocar npm run dev para ejecutar el servidor de NodeJS.
Persistencia de datos: Debe tener previamente el servicio de su preferencia para la ejecutar bases de datos relacionales, en mi caso LAMPP, importar la base de datos de su carpeta correspondiente en los archivos del BackEnd, en el gestor de base de datos MySQL de preferencia. Para evitar errores de conexión y errores inesperados.

# Usuarios Predeterminados.

Usuarios Predeterminados en la Base de Datos.

1) Correo: manuel@gmail.com Contraseña: 123123
2) Correo: maria@gmail.com Contraseña: 123123
3) Correo: luis@gmail.com Contraseña: 111111
4) Correo: jose@gmail.com Contraseña: 123123
