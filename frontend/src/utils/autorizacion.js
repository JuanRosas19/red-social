const autorizacionRequerida = (to, from, next) => {
  if (localStorage.getItem('token')) {
    next();
  } else {
    next('/login');
  }
};
const autorizacionNoRequerida = (to, from, next) => {
  if (localStorage.getItem('token')) {
    next('/');
  } else {
    next();
  }
};
const obtenerDatosToken = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
};
export { autorizacionNoRequerida, autorizacionRequerida, obtenerDatosToken };
