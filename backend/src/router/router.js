const { Router } = require('express');
const {
  loginUsuario,
  registrarUsuarios,
  obtenerUsuarios,
  modificarPerfil,
  modificarClave,
  eliminarPerfil,
  obtenerPosts,
  obtenerPostUsuario,
  crearPost,
  eliminarPost,
  modificarPost,
  obtenerPost,
  crearComentario,
  obtenerComentarios,
  eliminarComentarioDelPost,
  modificarComentario,
  eliminarComentario,
  obtenerAmigos,
  enviarSolicitudAmistad,
  obtenerSolicitudesPendientes,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
  obtenerPerfil,
  obtenerSolicitudesPendientesEnviadas,
} = require('../controller/controller');
const { autorizarPeticiones } = require('../middleware/autorizacion');
const multer = require('../middleware/subirArchivo');
const router = Router();

// Usuarios
router.post('/registro-usuario', registrarUsuarios);
router.post('/login-usuario', loginUsuario);
router.get('/obtener-usuarios', autorizarPeticiones, obtenerUsuarios);
router.put(
  '/modificar-perfil',
  autorizarPeticiones,
  multer.single('foto'),
  modificarPerfil
);
router.get('/obtener-perfil', autorizarPeticiones, obtenerPerfil);
router.put('/actualizar-clave', autorizarPeticiones, modificarClave);
router.delete('/eliminar-perfil', autorizarPeticiones, eliminarPerfil);

//Post
router.get('/obtener-posts', autorizarPeticiones, obtenerPosts);
router.get(
  '/obtener-posts/:usuarioId',
  autorizarPeticiones,
  obtenerPostUsuario
);
router.post(
  '/crear-post',
  autorizarPeticiones,
  multer.single('foto'),
  crearPost
);
router.delete('/eliminar-post/:postId', autorizarPeticiones, eliminarPost);
router.put('/actualizar-post/:postId', autorizarPeticiones, modificarPost);
router.get('/obtener-post/:postId', autorizarPeticiones, obtenerPost);

//Comentarios
router.post('/comentar-post/:postId', autorizarPeticiones, crearComentario);
router.get(
  '/obtener-comentarios/:postId',
  autorizarPeticiones,
  obtenerComentarios
);
router.delete(
  '/eliminar-comentario/:comentarioId',
  autorizarPeticiones,
  eliminarComentario
);
router.delete(
  '/eliminar-comentarios/:postId',
  autorizarPeticiones,
  eliminarComentarioDelPost
);
router.put(
  '/modificar-comentario/:comentarioId',
  autorizarPeticiones,
  modificarComentario
);

//Solicitudes
router.get('/obtener-amigos', autorizarPeticiones, obtenerAmigos);
router.post(
  '/enviar-solicitud/:usuarioId',
  autorizarPeticiones,
  enviarSolicitudAmistad
);
router.get(
  '/solicitudes-pendiente',
  autorizarPeticiones,
  obtenerSolicitudesPendientes
);
router.get(
  '/solicitudes-pendienteEnviadas',
  autorizarPeticiones,
  obtenerSolicitudesPendientesEnviadas
);
router.put(
  '/actualizar-estadoSolicitud/:id',
  autorizarPeticiones,
  actualizarEstadoSolicitud
);
router.delete(
  '/eliminar-solicitud/:id',
  autorizarPeticiones,
  eliminarSolicitud
);

module.exports = router;
