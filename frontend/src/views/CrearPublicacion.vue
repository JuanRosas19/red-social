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
            Añadir nueva publicación <i class="fa-solid fa-folder-plus"></i>
          </header>
          <form @submit.prevent="crearPublicacion">
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
              :placeholder="'¿Qué estas pensando hoy ' + nombreUsuario + '?'"
              spellcheck="false"
              required
              v-model.trim="post.contenido"
            ></textarea>
            <div class="opcion">
              <ul class="lista">
                <li><img src="../assets/icons/gallery.png" alt="imagen" /></li>
                <input @input="subirImagen" type="file" accept="image/*" />
              </ul>
            </div>
            <button type="submit">
              Agregar publicación <i class="fa-solid fa-cloud-arrow-up"></i>
            </button>
          </form>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { obtenerDatosToken } from "../utils/autorizacion";
import { crearPost } from "../servicios/posts/index";
export default {
  name: "CrearPublicacion",
  data() {
    return {
      nombreUsuario: "",
      post: {
        contenido: "",
        foto: [],
      },
    };
  },
  methods: {
    obtenerNombreToken() {
      const datos = obtenerDatosToken(localStorage.getItem("token"));
      this.nombreUsuario = datos.nombre;
    },
    subirImagen({ target }) {
      if (!this.post.foto.length) {
        this.post.foto.push(target.files[0]);
      } else {
        this.post.foto.pop();
        this.post.foto.push(target.files[0]);
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
    async crearPublicacion() {
      if (this.post.contenido.length) {
        const datosEnviar = new FormData();
        datosEnviar.append("contenido", this.post.contenido);
        if (this.post.foto.length) {
          datosEnviar.append("foto", this.post.foto[0]);
        }
        try {
          const response = await crearPost(datosEnviar);
          const data = await response.json();
          if (data.msg.includes("exitosamente")) {
            this.mostrarAlertaMensaje(data.msg, "success");
            this.post.contenido = "";
            this.post.foto = [];
            setTimeout(() => {
              this.$router.push("/");
            }, 2000);
          } else {
            this.mostrarAlertaMensaje(
              "No se pudo crear la publicación",
              "warning"
            );
          }
        } catch (error) {
          this.mostrarAlertaMensaje("Error al crear publicación", "error");
        }
      } else {
        this.mostrarAlertaMensaje(
          "Debes escribir el contenido para publicar",
          "warning"
        );
      }
    },
  },
  created() {
    this.obtenerNombreToken();
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
  height: 480px;
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
form .opcion {
  height: 57px;
  margin: 15px 0;
  padding: 0 15px;
  border-radius: 7px;
  border: 1px solid #b9b9b9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
form .opcion :where(.lista, li),
:where(.arrow-back, .icon, li .radio) {
  display: flex;
  align-items: center;
  justify-content: center;
}
form .opcion p {
  color: #595959;
  font-size: 15px;
  font-weight: 500;
  cursor: default;
}
form .opcion .lista {
  list-style: none;
}
.opcion .lista li {
  height: 42px;
  width: 42px;
  margin: 0 -1px;
  cursor: pointer;
  border-radius: 50%;
}
.opcion .lista li:hover {
  background: #f0f1f4;
}
.opcion .lista li img {
  width: 23px;
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
  background: #4599ff;
}
form textarea:valid ~ button:hover {
  background: #1a81ff;
}
.lista li .column .detalles p {
  font-weight: 500;
}
.lista li .column .detalles span {
  font-size: 14px;
  color: #65676b;
}
.lista li .radio {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  position: relative;
  border: 1px solid #707070;
}
.lista li.active .radio {
  border: 2px solid #4599ff;
}
.lista li .radio::before {
  content: "";
  width: 12px;
  height: 12px;
  border-radius: inherit;
}
.lista li.active .radio::before {
  background: #4599ff;
}
</style>