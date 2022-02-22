import { URL } from '../../constantes/main';

const obtenerComentarios = async (postId) => {
  return await fetch(URL + '/obtener-comentarios/' + postId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const agregarComentario = async (postId, comentario) => {
  return await fetch(URL + 'comentar-post/' + postId, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(comentario),
  });
};
const eliminarComentario = async (comentarioId) => {
  return await fetch(URL + 'eliminar-comentario/' + comentarioId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const editarComentario = async (comentarioId, comentario) => {
  return await fetch(URL + 'modificar-comentario/' + comentarioId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(comentario),
  });
};
export {
  obtenerComentarios,
  agregarComentario,
  eliminarComentario,
  editarComentario,
};
