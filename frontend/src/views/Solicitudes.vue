<template>
  <button
    title="Regresar en el historial de navegación"
    class="btn btn-secondary btn-regresar"
    @click="$router.go(-1)"
  >
    <i class="fa-solid fa-arrow-left"></i> Regresar
  </button>
  <div>
    <h1 class="center">
      Solictudes amistades pendientes <i class="fa-solid fa-user-clock"></i>
    </h1>
  </div>
  <div class="container">
    <template v-if="solicitudes && solicitudes.length">
      <ul class="tabla-estilos">
        <li class="table-header">
          <div class="columna columna-1">
            Foto <i class="fa-solid fa-image"></i>
          </div>
          <div class="columna columna-2">
            Nombre / Sexo / F. Nacimiento
            <i class="fa-solid fa-circle-user"></i>
          </div>
          <div class="columna columna-4">
            Estado <i class="fa-solid fa-clock"></i>
          </div>
          <div class="columna columna-4">
            Acciones <i class="fa-solid fa-check-double"></i>
          </div>
        </li>
        <div v-for="solicitud in solicitudes" :key="solicitud.id">
          <li class="table-row">
            <div class="columna columna-1" data-label="Foto">
              <img
                width="50"
                :src="
                  'http://localhost:3000/images/' + solicitud.usuario_id.foto
                "
                alt="Foto de perfil del usuario"
              />
            </div>
            <div
              class="columna columna-2"
              data-label="Nombre / Sexo / F. Nacimiento"
            >
              {{ solicitud.usuario_id.nombre }} /
              {{ solicitud.usuario_id.sexo }} /
              {{
                new Date(
                  solicitud.usuario_id.fecha_nacimiento
                ).toLocaleDateString()
              }}
            </div>
            <div class="columna columna-3" data-label="Estado">
              <span class="pendiente">Pendiente </span>
            </div>
            <div class="columna columna-2" data-label="Acciones">
              <button
                @click="modificarSolictud(1, solicitud.id)"
                title="Aceptar solicitud"
                class="boton boton-aceptar"
              >
                <i class="fa-solid fa-user-check"></i>
              </button>
              <button
                @click="eliminarSolicitudUsuario(solicitud.id)"
                title="Rechazar solicitud"
                class="boton boton-rechazar"
              >
                <i class="fa-solid fa-user-xmark"></i>
              </button>
            </div>
          </li>
        </div>
      </ul>
    </template>
    <template v-else>
      <p class="center gray">
        No tienes solicitudes pendientes actualmente
        <i class="fa-solid fa-users-slash"></i>
      </p>
    </template>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import {
  obtenerSolicitudes,
  eliminarSolicitud,
  actualizarSolicitud,
} from "../servicios/amistades/index";
export default {
  name: "Solicitudes",
  data() {
    return {
      solicitudes: [],
    };
  },
  created() {
    this.obtenerSolicitudesUsuario();
  },
  methods: {
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
    async obtenerSolicitudesUsuario() {
      try {
        const response = await obtenerSolicitudes();
        const { solicitudes } = await response.json();
        this.solicitudes = solicitudes.reverse();
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo las solicitudes",
          "error"
        );
      }
    },
    async modificarSolictud(estado, id) {
      try {
        const response = await actualizarSolicitud(estado, id);
        const { msg } = await response.json();
        if (!msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "warning");
          return;
        }
        this.mostrarAlertaMensaje(msg, "success");
        this.obtenerSolicitudesUsuario();
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error actualizando la solicitud",
          "error"
        );
      }
    },
    async eliminarSolicitudUsuario(id) {
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
            const response = await eliminarSolicitud(id);
            const { msg } = await response.json();
            if (msg.includes("exitosamente")) {
              this.mostrarAlertaMensaje(msg, "success");
              this.obtenerSolicitudesUsuario();
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
.container {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 10px;
  padding-right: 10px;
}
.pendiente {
  color: #ef6a1c;
}
.boton-aceptar {
  background-color: #1d9100;
  margin: 1em;
}
.boton-rechazar {
  background-color: #ef6a1c;
  margin: 1em;
}
h2 {
  font-size: 26px;
  margin: 20px 0;
  text-align: center;
}
h2 small {
  font-size: 0.5em;
}
.tabla-estilos li {
  border-radius: 3px;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
}
.tabla-estilos .table-header {
  background-color: #1a81ff;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #fff;
}
.tabla-estilos .table-row {
  background-color: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.1);
}
.tabla-estilos .columna-1 {
  flex-basis: 10%;
}
.tabla-estilos .columna-2 {
  flex-basis: 40%;
}
.tabla-estilos .columna-3 {
  flex-basis: 25%;
}
.tabla-estilos .columna-4 {
  flex-basis: 25%;
}
@media (max-width: 767px) {
  .tabla-estilos .table-header {
    display: none;
  }
  .tabla-estilos li {
    display: block;
  }
  .tabla-estilos .columna {
    flex-basis: 100%;
  }
  .tabla-estilos .columna {
    display: flex;
    padding: 10px 0;
  }
  .tabla-estilos .columna:before {
    color: #6c7a89;
    padding-right: 10px;
    content: attr(data-label);
    flex-basis: 50%;
    text-align: right;
  }
}
.center {
  text-align: center;
  margin-top: 3em;
  margin-bottom: 2em;
}
</style>