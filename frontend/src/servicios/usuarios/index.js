import { URL } from '../../constantes/main';

const registroUsuario = async (usuario) => {
  const url = `${URL}registro-usuario`;
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(usuario),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
const loginUsuario = async (usuario) => {
  const url = `${URL}login-usuario`;
  return await fetch(url, {
    method: 'POST',
    body: JSON.stringify(usuario),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
const obtenerUsuarios = async () => {
  const url = `${URL}obtener-usuarios`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const actualizarClave = async (clave) => {
  const url = `${URL}actualizar-clave`;
  return await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(clave),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const eliminarPerfil = async () => {
  const url = `${URL}eliminar-perfil`;
  return await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const actualizarPerfil = async (usuario) => {
  const url = `${URL}modificar-perfil`;
  return await fetch(url, {
    method: 'PUT',
    body: usuario,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const obtenerPerfil = async () => {
  const url = `${URL}obtener-perfil`;
  return await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

export {
  registroUsuario,
  loginUsuario,
  obtenerUsuarios,
  actualizarClave,
  eliminarPerfil,
  actualizarPerfil,
  obtenerPerfil,
};
