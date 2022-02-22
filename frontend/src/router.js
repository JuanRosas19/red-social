import { createRouter, createWebHashHistory } from 'vue-router';
import Main from './views/Main.vue';
import LoginRegistro from './views/LoginRegistro.vue';
import CrearPublicacion from './views/CrearPublicacion.vue';
import DetallesPost from './views/DetallesPost.vue';
import EditarPost from './views/EditarPost.vue';
import ActualizarClave from './views/ActualizarClave.vue';
import ActualizarPerfil from './views/ActualizarPerfil.vue';
import Usuarios from './views/Usuarios.vue';
import Solicitudes from './views/Solicitudes.vue';
import Amigos from './views/Amigos.vue';
import {
  autorizacionNoRequerida,
  autorizacionRequerida,
} from './utils/autorizacion';
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Main,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/login',
      component: LoginRegistro,
      beforeEnter: autorizacionNoRequerida,
    },
    {
      path: '/crear-post',
      component: CrearPublicacion,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/detalles-post/:id',
      component: DetallesPost,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/post-editar/:id',
      component: EditarPost,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/actualizar-clave',
      component: ActualizarClave,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/actualizar-perfil',
      component: ActualizarPerfil,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/usuarios',
      component: Usuarios,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/solicitudes',
      component: Solicitudes,
      beforeEnter: autorizacionRequerida,
    },
    {
      path: '/amigos',
      component: Amigos,
      beforeEnter: autorizacionRequerida,
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
});
