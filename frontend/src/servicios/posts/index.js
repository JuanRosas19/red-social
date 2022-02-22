import { URL } from '../../constantes/main';

const obtenerPosts = async () => {
  return await fetch(URL + 'obtener-posts', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const obtenerPost = async (id) => {
  return await fetch(URL + `/obtener-post/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const crearPost = async (postInfo) => {
  return await fetch(URL + 'crear-post', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: postInfo,
  });
};
const eliminarPost = async (postId) => {
  return await fetch(URL + 'eliminar-post/' + postId, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const actualizarPost = async (postId, contenido) => {
  return await fetch(URL + 'actualizar-post/' + postId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(contenido),
  });
};
export { obtenerPosts, crearPost, obtenerPost, eliminarPost, actualizarPost };
