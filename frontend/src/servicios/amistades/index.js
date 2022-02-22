import { URL } from '../../constantes/main';

const enviarSolicitud = (id) => {
  return fetch(`${URL}enviar-solicitud/${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const obtenerSolicitudes = () => {
  return fetch(`${URL}solicitudes-pendiente`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
const obtenerSolicitudesEnviadas = () => {
  return fetch(`${URL}solicitudes-pendienteEnviadas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const eliminarSolicitud = (id) => {
  return fetch(`${URL}eliminar-solicitud/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};

const actualizarSolicitud = (estado, id) => {
  return fetch(`${URL}actualizar-estadoSolicitud/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      estado,
    }),
  });
};
const obtenerAmigos = () => {
  return fetch(`${URL}obtener-amigos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
export {
  enviarSolicitud,
  obtenerSolicitudes,
  obtenerSolicitudesEnviadas,
  eliminarSolicitud,
  actualizarSolicitud,
  obtenerAmigos,
};
