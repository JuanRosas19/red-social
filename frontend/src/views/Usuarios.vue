<template>
  <div>
    <button
      title="Regresar en el historial de navegación"
      class="btn btn-secondary btn-regresar"
      @click="$router.go(-1)"
    >
      <i class="fa-solid fa-arrow-left"></i> Regresar
    </button>
    <h1 class="center">
      Usuarios registrados en la plataforma
      <i class="fa-solid fa-user-group"></i>
    </h1>
  </div>
  <template v-if="usuarios && usuarios.length">
    <div class="contenedor-buscador">
      <input
        class="buscador-usuarios"
        placeholder="Filtrar por nombre del cliente..."
        type="text"
        v-model.trim="filtrado"
      />
    </div>
    <div class="container">
      <div
        class="usuario"
        v-for="usuario in usuariosFiltrados"
        :key="usuario.id"
      >
        <img
          v-if="usuario.foto && usuario.foto.length"
          :src="'http://localhost:3000/images/' + usuario.foto"
          alt="Person"
          class="usuario-imagen"
        />
        <p class="usuario-nombre">{{ usuario.nombre }}</p>
        <div class="contenedor-grid">
          <div class="contenedor-grid-post">
            <i class="fa-solid fa-table-list"></i>
            {{ usuario.cantidadPost }} Post
          </div>

          <div class="contenedor-grid-comentatios">
            <i class="fa-solid fa-comments"></i>
            {{ usuario.cantidadComentarios }} comentarios
          </div>
        </div>
        <h3 class="datos-usuario">
          <i class="fa-solid fa-venus-mars"></i> {{ usuario.sexo }}
        </h3>
        <h3 class="datos-usuario">
          <i class="fa-solid fa-cake-candles"></i>
          {{ new Date(usuario.fecha_nacimiento).toLocaleDateString() }}
        </h3>
        <h3 class="datos-usuario">
          <i class="fa-solid fa-envelope"></i> {{ usuario.usuario }}
        </h3>
        <h3 class="datos-usuario">
          <i class="fa-solid fa-calendar-plus"></i> Creado el:
          {{ new Date(usuario.creado_el).toLocaleDateString() }}
        </h3>
        <button
          v-if="!usuario.eliminarSolicitud"
          @click="enviarSolicitudUsuario(usuario.id)"
          class="boton-usuarios boton-borde"
        >
          Enviar <i class="fa-solid fa-user-plus"></i>
        </button>
        <button
          v-if="
            solicitudesEnviadas &&
            solicitudesEnviadas.length &&
            usuario.eliminarSolicitud
          "
          @click="eliminarSolicitudEliminar(usuario.idSolicitud.id)"
          class="boton-usuarios-eliminar"
        >
          Eliminar solicitud <i class="fa-solid fa-user-xmark"></i>
        </button>
      </div>
    </div>
  </template>
  <template v-else>
    <p class="gray center">
      No existen usuarios registrados actualmente
      <i class="fa-solid fa-users-slash"></i>
    </p>
  </template>
</template>

<script>
import Swal from "sweetalert2";
import { obtenerUsuarios } from "../servicios/usuarios/index";
import {
  obtenerSolicitudesEnviadas,
  eliminarSolicitud,
} from "../servicios/amistades/index";
import { enviarSolicitud } from "../servicios/amistades/index";
export default {
  name: "Usuarios",
  data() {
    return {
      usuarios: [],
      solicitudesEnviadas: [],
      filtrado: "",
    };
  },
  created() {
    this.obtenerUsuariosRegistrados();
    this.obtenerSolicitudesEnviadasUsuario();
  },
  computed: {
    usuariosListado() {
      if (!this.usuarios.length) return [];
      //Comprobar si existen usuarios con solicitud enviada
      let usuariosConSolicitud = this.usuarios.filter((usuario) => {
        return this.solicitudesEnviadas.find((solicitud) => {
          return solicitud.usuario_solicita_id === usuario.id;
        });
      });
      //Agregar campo para mostrar boton de eliminar solicitud
      usuariosConSolicitud.forEach((usuario) => {
        usuario.eliminarSolicitud = true;
        usuario.idSolicitud = this.solicitudesEnviadas.find((solicitud) => {
          return solicitud.usuario_solicita_id === usuario.id;
        });
      });
      //Retorna los usuarios con y sin solicitud
      return [
        ...usuariosConSolicitud,
        ...this.usuarios.filter((usuario) => {
          return !usuariosConSolicitud.find((usuarioConSolicitud) => {
            return usuarioConSolicitud.id === usuario.id;
          });
        }),
      ];
    },
    usuariosFiltrados() {
      if (!this.filtrado.length || this.filtrado.length < 2)
        return this.usuariosListado;
      return this.usuariosListado.filter((usuario) =>
        usuario.nombre.toLowerCase().includes(this.filtrado.toLowerCase())
      );
    },
  },
  methods: {
    async obtenerSolicitudesEnviadasUsuario() {
      try {
        const response = await obtenerSolicitudesEnviadas();
        const { solicitudes } = await response.json();
        this.solicitudesEnviadas = solicitudes;
        this.usuariosListado;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error al obtener las solicitudes",
          "error"
        );
      }
    },
    mostrarAlertaMensaje(contenido, tipo) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      Toast.fire({
        icon: tipo,
        title: contenido,
      });
    },
    async obtenerUsuariosRegistrados() {
      try {
        const response = await obtenerUsuarios();
        const { usuarios } = await response.json();
        this.usuarios = usuarios;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obtenidos los usuarios",
          "error"
        );
      }
    },
    async enviarSolicitudUsuario(usuarioId) {
      try {
        const response = await enviarSolicitud(usuarioId);
        const { msg } = await response.json();
        if (msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "success");
          this.obtenerUsuariosRegistrados();
          this.obtenerSolicitudesEnviadasUsuario();
          return;
        }
        this.mostrarAlertaMensaje(msg, "warning");
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obtenidos los usuarios",
          "error"
        );
      }
    },
    async eliminarSolicitudEliminar(solicitudId) {
      Swal.fire({
        title: "¿Estas seguro en eliminar la solicitud?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await eliminarSolicitud(solicitudId);
            const { msg } = await response.json();
            if (msg.includes("exitosamente")) {
              this.mostrarAlertaMensaje(msg, "success");
              this.obtenerSolicitudesEnviadasUsuario();
              this.obtenerUsuariosRegistrados();
              return;
            }
            this.mostrarAlertaMensaje(msg, "warning");
          } catch (error) {
            this.mostrarAlertaMensaje(
              "Ocurrió un error eliminando la solicitud",
              "error"
            );
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.contenedor-buscador {
  width: 100%;
  text-align: center;
  margin-top: 2em;
  margin-bottom: 2em;
}
.buscador-usuarios {
  width: 43%;
  padding: 1em;
  border-radius: 3em;
  border: 1px solid #1877f2;
}
.center {
  text-align: center;
  margin-top: 2.5em;
  margin-bottom: 2em;
}

.container {
  display: grid;
  grid-template-columns: 300px 300px 300px;
  grid-gap: 50px;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.contenedor-grid-comentatios,
.contenedor-grid-post {
  margin: 1em;
  text-align: center;
  font-size: 1em;
}

.usuario {
  background-color: #0f2c68;
  height: 39em;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.7);
  color: white;
}
.usuario-nombre {
  margin-top: 15px;
  font-size: 1.5em;
}

.usuario-imagen {
  height: 160px;
  width: 160px;
  border-radius: 50%;
  border: 5px solid #272133;
  margin-top: 20px;
  box-shadow: 0 10px 50px #1ec5a6;
}

.boton-borde {
  box-shadow: inset 0 0 0 4px #58cdd1;
  color: #58afd1;
  -webkit-transition: color 0.25s 0.0833333333s;
  transition: color 0.25s 0.0833333333s;
  position: relative;
}
.datos-usuario {
  margin-top: 1em;
  font-size: 1.2em;
}

.boton-borde::before,
.boton-borde::after {
  border: 0 solid transparent;
  box-sizing: border-box;
  content: "";
  pointer-events: none;
  position: absolute;
  width: 0rem;
  height: 0;
  bottom: 0;
  right: 0;
}

.boton-borde::before {
  border-bottom-width: 4px;
  border-left-width: 4px;
}

.boton-borde::after {
  border-top-width: 4px;
  border-right-width: 4px;
}

.boton-borde:hover {
  color: #ffe593;
}

.boton-borde:hover::before,
.boton-borde:hover::after {
  border-color: #ff9a03;
  -webkit-transition: border-color 0s, width 0.25s, height 0.25s;
  transition: border-color 0s, width 0.25s, height 0.25s;
  width: 100%;
  height: 100%;
}

.boton-borde:hover::before {
  -webkit-transition-delay: 0s, 0s, 0.25s;
  transition-delay: 0s, 0s, 0.25s;
}

.boton-borde:hover::after {
  -webkit-transition-delay: 0s, 0.25s, 0s;
  transition-delay: 0s, 0.25s, 0s;
}

.boton-usuarios {
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1.5;
  font: 700 1.2rem "Roboto Slab", sans-serif;
  padding: 0.75em 2em;
  letter-spacing: 0.05rem;
  margin: 1em;
  width: 13rem;
}
.boton-usuarios-eliminar {
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1.5;
  padding: 10px;
  width: 10rem;
  height: 3em;
  background: #fb6060;
  color: white;
  border-radius: 3em;
  margin: 2em;
}
.boton-usuarios-eliminar:hover {
  background: #e22c2c;
}

.boton-usuarios:focus {
  outline: 2px dotted #55d7dc;
}

.contenedor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  font-size: 1.2em;
}
@media (max-width: 1100px) {
  .contenedor-grid {
    grid-template-columns: 1fr;
  }

  .usuario {
    grid-column: 1 / 2;
    height: 40em;
  }
  .container {
    grid-template-columns: 1fr;
    margin: 3em;
    padding: 3em;
  }
}
</style>