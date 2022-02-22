<template>
  <div>
    <button
      title="Regresar en el historial de navegación"
      class="btn btn-secondary btn-regresar"
      @click="$router.go(-1)"
    >
      <i class="fa-solid fa-arrow-left"></i> Regresar
    </button>
    <div class="container">
      <div class="wrapper">
        <section class="post">
          <header>
            Actualizar contenido de la publicación
            <i class="fa-solid fa-pen-to-square"></i>
          </header>
          <form @submit.prevent="actualizarPublicacion">
            <div class="content">
              <div class="detalles">
                <p>{{ nombreUsuario }}</p>
                <div class="publico">
                  <i class="fa-solid fa-earth-americas"></i>
                  <span>Público</span>
                </div>
              </div>
            </div>
            <textarea
              :placeholder="
                'Actualizar contenido de la publicacion de ' + nombreUsuario
              "
              spellcheck="false"
              required
              v-model.trim="post.contenido"
            ></textarea>
            <button type="submit">
              Actualizar publicación <i class="fa-solid fa-rotate"></i>
            </button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerDatosToken } from "../utils/autorizacion";
import { obtenerPost, actualizarPost } from "../servicios/posts/index";
import Swal from "sweetalert2";
export default {
  name: "EditarPost",
  data() {
    return {
      post: {
        contenido: "",
      },
      nombreUsuario: "",
    };
  },
  created() {
    this.obtenerNombreToken();
    this.obtenerDatosPost();
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
    obtenerNombreToken() {
      const datos = obtenerDatosToken(localStorage.getItem("token"));
      this.nombreUsuario = datos.nombre;
    },
    async obtenerDatosPost() {
      try {
        const response = await obtenerPost(this.$route.params.id);
        const { post } = await response.json();
        this.post = post;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo los datos del post",
          "warning"
        );
      }
    },
    async actualizarPublicacion() {
      if (!this.post.contenido) {
        return this.mostrarAlertaMensaje(
          "El contenido es requerido para actualizar el post",
          "warning"
        );
      }
      try {
        const response = await actualizarPost(this.$route.params.id, {
          contenido: this.post.contenido,
        });
        const { msg } = await response.json();
        if (msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "success");
          setTimeout(() => {
            this.$router.push("/");
          }, 2000);
          return;
        }
        this.mostrarAlertaMensaje(
          "No se pudo actualizar la publicacion",
          "warning"
        );
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error actualizando la publicacion",
          "error"
        );
      }
    },
  },
};
</script>

<style scoped>
body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
::selection {
  color: #fff;
  background: #1a81ff;
}
.container {
  width: 500px;
  overflow: hidden;
  background: #fff;
  border-radius: 10px;
  transition: height 0.2s ease;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  margin: 0 auto;
  margin-top: 5em;
}
.container.active {
  height: 590px;
}
.container .wrapper {
  width: 1000px;
  display: flex;
}
.container .wrapper section {
  width: 500px;
  background: #fff;
}
.container img {
  cursor: pointer;
}
.container .post {
  transition: margin-left 0.18s ease;
}
.container.active .post {
  margin-left: -500px;
}
.post header {
  font-size: 22px;
  font-weight: 600;
  padding: 17px 0;
  text-align: center;
  border-bottom: 1px solid #bfbfbf;
}
.post form {
  margin: 20px 25px;
}
.post form .content,
.post form .content img {
  cursor: default;
  max-width: 52px;
}
.post form .content .detalles {
  margin: -3px 0 0 12px;
}
form .content .detalles p {
  font-size: 17px;
  font-weight: 500;
}
.content .detalles .publico {
  display: flex;
  height: 25px;
  cursor: pointer;
  padding: 0 10px;
  font-size: 11px;
  margin-top: 3px;
  border-radius: 5px;
  align-items: center;
  max-width: 98px;
  background: #e4e6eb;
  justify-content: space-between;
  width: 7em;
}
.detalles .publico span {
  font-size: 13px;
  margin-top: 1px;
  font-weight: 500;
}
.detalles .publico i:last-child {
  font-size: 13px;
  margin-left: 1px;
}
form :where(textarea, button) {
  width: 100%;
  outline: none;
  border: none;
}
form textarea {
  resize: none;
  font-size: 18px;
  margin-top: 30px;
  min-height: 100px;
}
form textarea::placeholder {
  color: #858585;
}
form textarea:focus::placeholder {
  color: #b3b3b3;
}
form :where(.theme-emoji, .opcion) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
form button {
  height: 53px;
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  color: #bcc0c4;
  cursor: no-drop;
  border-radius: 7px;
  background: #e2e5e9;
  transition: all 0.3s ease;
}
form textarea:valid ~ button {
  color: #fff;
  cursor: pointer;
  background: #1e7e77;
}
form textarea:valid ~ button:hover {
  background: #11a198;
}
.lista li .column .detalles p {
  font-weight: 500;
}
.lista li .column .detalles span {
  font-size: 14px;
  color: #65676b;
}
.lista li.active .radio::before {
  background: #4599ff;
}
</style>