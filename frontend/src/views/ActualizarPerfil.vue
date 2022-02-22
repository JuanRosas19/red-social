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
      Actualizar datos del perfil <i class="fa-solid fa-id-card"></i>
    </h1>
  </div>
  <div class="contenedor-perfil" v-if="perfil && Object.keys(perfil).length">
    <img
      class="img-perfil"
      :src="'http://localhost:3000/images/' + perfil.foto"
      alt="Foto de perfil"
    />
    <h3><i class="fa-solid fa-circle-user"></i> {{ perfil.nombre }}</h3>
    <h6><i class="fa-solid fa-venus-mars"></i> {{ perfil.sexo }}</h6>
    <h6>
      <i class="fa-solid fa-cake-candles"></i> {{ perfil.fecha_nacimiento }}
    </h6>
    <h6><i class="fa-solid fa-envelope"></i> {{ perfil.usuario }}</h6>
    <h6>
      <i class="fa-solid fa-calendar-plus"></i> Creado el:
      {{ new Date(perfil.creado_el).toLocaleDateString() }}
    </h6>
    <h6>
      <i class="fa-solid fa-table-list"></i> N° Posts:
      {{ cantidadPost }}
    </h6>
    <h6>
      <i class="fa-solid fa-comments"></i> N° Comentarios:
      {{ cantidadComentarios }}
    </h6>

    <div class="seccion-actualizar">
      <h6 class="titulo-actualizar">
        Actualizar información <i class="fa-solid fa-user-pen"></i>
      </h6>
      <div class="contenedor-input">
        <input
          v-model.trim="datosActualizar.nombre"
          class="input-style"
          placeholder="Nombre del usuario"
          type="text"
          required
        />
        <select
          required
          v-model.trim="datosActualizar.sexo"
          class="input-style"
        >
          <option value="" disabled selected>Seleccionar genero</option>
          <option v-for="genero in generos" :value="genero" :key="genero">
            {{ genero }}
          </option>
        </select>
      </div>
      <div class="contenedor-input">
        <input
          v-model="datosActualizar.fecha_nacimiento"
          class="input-style"
          type="date"
          max="2015-01-01"
          required
        />
        <input
          v-model.trim="datosActualizar.usuario"
          class="input-style"
          placeholder="Usuario de acceso"
          type="email"
          required
        />
      </div>
      <div class="contenedor-input-2">
        <input
          accept="image/jpg,image/jpeg,image/png"
          @input="actualizarFoto"
          class="input-style-file"
          type="file"
        />
      </div>
      <div class="contenedor-input-2">
        <button @click="actualizarDatosPerfil" class="boton boton-actualizar">
          Actualizar datos <i class="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerPerfil, actualizarPerfil } from "../servicios/usuarios";
import Swal from "sweetalert2";
export default {
  name: "ActualizarPerfil",
  data() {
    return {
      perfil: {},
      cantidadComentarios: null,
      cantidadPost: null,
      generos: ["Masculino", "Femenino"],
      datosActualizar: {
        nombre: "",
        sexo: "",
        usuario: "",
        fecha_nacimiento: "",
        foto: [],
      },
    };
  },
  created() {
    this.obtenerDatosPerfil();
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
    async obtenerDatosPerfil() {
      try {
        const response = await obtenerPerfil();
        const { usuario, cantidadPost, cantidadComentarios } =
          await response.json();
        if (!usuario.length) {
          this.mostrarAlertaMensaje(
            "El usuario solicitado no existe",
            "warning"
          );
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
          return;
        }
        this.perfil = usuario[0];
        this.datosActualizar = {
          nombre: usuario[0].nombre,
          sexo: usuario[0].sexo,
          usuario: usuario[0].usuario,
          fecha_nacimiento: this.formatearFecha(usuario[0].fecha_nacimiento),
          foto: [],
        };
        this.cantidadComentarios = cantidadComentarios;
        this.cantidadPost = cantidadPost;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo los datos del perfil del usuario",
          "error"
        );
      }
    },
    actualizarFoto(e) {
      const file = e.target.files[0];
      if (!file) return;
      if (!this.datosActualizar.foto.length) {
        this.datosActualizar.foto.push(file);
      } else {
        this.datosActualizar.foto.pop();
        this.datosActualizar.foto.push(file);
      }
    },
    formatearFecha(fecha) {
      return new Date(fecha).toISOString().substring(0, 10);
    },
    async actualizarDatosPerfil() {
      if (
        !this.datosActualizar.nombre ||
        !this.datosActualizar.sexo ||
        !this.datosActualizar.usuario ||
        !this.datosActualizar.fecha_nacimiento
      ) {
        this.mostrarAlertaMensaje(
          "Todos los campos excepto la foto son requeridos",
          "warning"
        );
        return;
      }
      const formData = new FormData();
      formData.append("nombre", this.datosActualizar.nombre);
      formData.append("sexo", this.datosActualizar.sexo);
      formData.append("usuario", this.datosActualizar.usuario);
      formData.append(
        "fecha_nacimiento",
        this.datosActualizar.fecha_nacimiento
      );
      if (this.datosActualizar.foto.length) {
        formData.append("foto", this.datosActualizar.foto[0]);
      }
      try {
        const response = await actualizarPerfil(formData);
        const { msg } = await response.json();
        if (!msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "warning");
          return;
        }
        this.mostrarAlertaMensaje(msg, "success");
        this.datosActualizar = {
          nombre: "",
          sexo: "",
          usuario: "",
          fecha_nacimiento: "",
          foto: [],
        };
        this.obtenerDatosPerfil();
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error actualizando los datos del perfil del usuario",
          "error"
        );
      }
    },
  },
};
</script>
<style scoped>
.center {
  text-align: center;
  margin-bottom: 2em;
  margin-top: 2em;
}
h3 {
  margin: 10px 0;
}

h6 {
  margin: 5px 0;
  text-transform: uppercase;
}

p {
  font-size: 14px;
  line-height: 21px;
}
.contenedor-input {
  display: flex;
  justify-content: space-between;
  margin: 1em 0;
}
.contenedor-input-2 {
  display: flex;
  justify-content: center;
  margin: 1em 0;
}
.input-style-file {
  width: 85%;
  height: 50px;
  border: 1px solid #d6dde5;
  border-radius: 1em;
  padding: 0 10px;
  font-size: 14px;
  line-height: 21px;
  background: #375597;
  padding: 1em;
}
.input-style {
  width: 50%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 0 10px;
  margin: 0 8px;
}
.contenedor-perfil {
  background-color: #081a4a;
  border-radius: 1em;
  box-shadow: 0px 10px 20px -10px rgb(0 0 0 / 75%);
  color: #b3b8cd;
  padding-top: 30px;
  position: relative;
  width: 24em;
  max-width: 100%;
  text-align: center;
  margin: 0 auto;
  margin-bottom: 2em;
}

.contenedor-perfil .img-perfil {
  border: 1px solid #03bfcb;
  border-radius: 50%;
  padding: 7px;
  width: 8em;
}

.boton-actualizar {
  display: block;
  width: 100%;
  background: #21af82;
}
.boton-actualizar:hover {
  background: #258566;
}
.titulo-actualizar {
  text-align: center;
  margin-bottom: 2em;
}
.seccion-actualizar {
  background-color: #295895;
  text-align: left;
  padding: 15px;
  margin-top: 30px;
  height: 19em;
}
</style>