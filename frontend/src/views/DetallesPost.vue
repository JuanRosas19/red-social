<template>
  <div style="margin-top: 6em">
    <button
      title="Regresar en el historial de navegación"
      class="btn btn-secondary btn-regresar"
      @click="$router.go(-1)"
    >
      <i class="fa-solid fa-arrow-left"></i> Regresar
    </button>
    <h1 class="center">
      Detalles del post <i class="fa-solid fa-circle-info"></i>
    </h1>
    <div
      class="center-boton"
      v-if="
        post &&
        Object.keys(post).length &&
        post.usuario_id.id === idUsuarioActual
      "
    >
      <button
        @click="$router.push('/post-editar/' + post.id)"
        class="boton boton-editar"
      >
        Editar <i class="fa-solid fa-pen-to-square"></i>
      </button>
      <button @click="eliminarPost" class="boton boton-eliminar">
        Eliminar <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
    <div class="container">
      <div class="post" v-if="post && Object.keys(post).length">
        <div class="header-post">
          <img
            v-if="post.foto && post.foto.length"
            :src="'http://localhost:3000/images/' + post.foto || ''"
            alt=""
          />
        </div>
        <div class="cuerpo-post">
          <div class="post-contenido">
            <p class="center contenido">
              {{ post.contenido }}
            </p>

            <div class="container_infos">
              <div class="autor">
                <span>Autor</span>
                <img
                  v-if="fotoPerfil && fotoPerfil.length"
                  :src="'http://localhost:3000/images/' + fotoPerfil || ''"
                  width="40"
                  height="40"
                  alt="foto-perfil"
                  class="perfil"
                  style="margin-bottom: 1em"
                />
                {{ post.usuario_id.nombre }}
              </div>

              <div class="contenedor-fecha">
                <span>fecha</span>
                <div class="fecha">
                  <p>{{ new Date(post.fecha).toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <h2 class="center">
        Comentarios de la publicación <i class="fa-solid fa-comments"></i>
      </h2>
      <div class="bloque-comentario">
        <div class="crear-comentario">
          <div class="perfil">
            <img
              v-if="fotoPerfil && fotoPerfil.length"
              :src="'http://localhost:3000/images/' + fotoPerfil || ''"
            />
          </div>
          <div class="input-comentario">
            <input
              v-model.trim="comentario"
              type="text"
              placeholder="Únete a la conversación..."
            />
            <button
              @click="agregarComentarioPost"
              :class="[
                'boton',
                esEditar ? 'boton-comentario-editar' : 'boton-comentario',
              ]"
            >
              {{ esEditar ? "Actualizar comentario " : "Agregar comentario "
              }}<i
                :class="[
                  'fa-solid',
                  esEditar ? 'fa-message' : 'fa-comment-dots',
                ]"
              ></i>
            </button>
            <!-- En caso sea editar, muestra boton para cancelar la edicion -->
            <button
              v-if="esEditar"
              @click="limpiarEdicionComentario"
              class="boton boton-cancelar"
            >
              Cancelar <i class="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
        <template v-if="comentarios && comentarios.length">
          <div v-for="comentario in comentarios" :key="comentario.id">
            <div class="nuevo-comentario">
              <ul class="usuario">
                <div class="perfil">
                  <img
                    v-if="
                      comentario.usuario_id.foto &&
                      comentario.usuario_id.foto.length
                    "
                    :src="
                      'http://localhost:3000/images/' +
                      comentario.usuario_id.foto
                    "
                  />
                </div>
                <div class="cuerpo-comentario">
                  <p>
                    {{ comentario.comentario }}
                  </p>
                </div>
                <div class="comentario-iconos">
                  <div class="comentario-detalles">
                    <ul>
                      <li>
                        <i class="fa fa-calendar"></i
                        >{{ " " + new Date(comentario.fecha).toLocaleString() }}
                      </li>
                      <li>
                        <i class="fa-solid fa-user-pen"></i>
                        <span class="user">
                          {{ " " + comentario.usuario_id.nombre }}.
                        </span>
                      </li>
                      <li
                        @click="eliminarComentarioPost(comentario.id)"
                        v-if="
                          (comentario.usuario_id.id === idUsuarioActual &&
                            comentario.post_id === post.id) ||
                          idUsuarioActual === post?.usuario_id?.id
                        "
                        style="color: #ff4d4d !important"
                      >
                        <i class="fa-solid fa-comment-slash"></i>
                        <span>
                          {{
                            idUsuarioActual === post.usuario_id.id
                              ? "Borrar comentario de mi post"
                              : "Eliminar comentario"
                          }}
                        </span>
                      </li>
                      <!-- Si es el autor del comentarios, mostrar boton para editar -->
                      <li
                        @click="establecerEditarComentario(comentario)"
                        v-if="
                          comentario.usuario_id.id === idUsuarioActual &&
                          comentario.post_id === post.id
                        "
                        style="color: #4285f4 !important"
                      >
                        <i class="fa-solid fa-pen-to-square"></i>
                        <span> Editar comentario </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </template>
        <template v-else>
          <p class="gray center">
            No existen comentarios en esta publicación
            <i class="fa-solid fa-comment-slash"></i>
          </p>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { obtenerPerfil } from "../servicios/usuarios";
import { obtenerPost, eliminarPost } from "../servicios/posts/index";
import {
  obtenerComentarios,
  eliminarComentario,
  agregarComentario,
  editarComentario,
} from "../servicios/comentarios/index";
import Swal from "sweetalert2";
export default {
  name: "DetallesPost",
  data() {
    return {
      post: {},
      fotoPerfil: "",
      idUsuarioActual: "",
      comentarios: [],
      mostrarAccionesPost: false,
      comentario: "",
      esEditar: false,
      comentarioSeleccionado: null,
    };
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
    async obtenerDatosTokenUsuario() {
      try {
        const response = await obtenerPerfil();
        const { usuario } = await response.json();
        this.idUsuarioActual = usuario[0].id;
        this.fotoPerfil = usuario[0].foto;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo los datos del usuario",
          "error"
        );
      }
    },
    async obtenerComentariosDelPost() {
      try {
        const response = await obtenerComentarios(this.$route.params.id);
        const { comentarios } = await response.json();
        this.comentarios = comentarios.reverse();
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo los comentarios del post",
          "error"
        );
      }
    },
    async obtenerDatosPost() {
      try {
        const response = await obtenerPost(this.$route.params.id);
        const { post } = await response.json();
        this.post = post;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error obteniendo los datos del post",
          "error"
        );
      }
    },
    async eliminarPost() {
      Swal.fire({
        title: "¿Estas seguro en eliminar el post?",
        text: "Al eliminar el post se iran sus comentarios",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await eliminarPost(this.$route.params.id);
            const { msg } = await response.json();
            if (msg.includes("exitosamente")) {
              this.mostrarAlertaMensaje(msg, "success");
              setTimeout(() => {
                this.$router.push("/");
              }, 2000);
              return;
            }
            this.mostrarAlertaMensaje(
              "No se pudo error eliminado el post",
              "warning"
            );
          } catch (error) {
            this.mostrarAlertaMensaje(
              "Ocurrió un error eliminado el post",
              "error"
            );
          }
        }
      });
    },
    async editarComentarioPost(comentario) {
      try {
        const response = await editarComentario(this.comentarioSeleccionado, {
          comentario,
        });
        const { msg } = await response.json();
        if (msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "success");
          this.obtenerComentariosDelPost();
          this.limpiarEdicionComentario();
          return;
        }
        this.mostrarAlertaMensaje("No se pudo editar el comentario", "warning");
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error editando el comentario",
          "error"
        );
      }
    },
    async agregarComentarioPost() {
      if (this.comentario === "") {
        this.mostrarAlertaMensaje(
          "El comentario no puede estar vacio",
          "warning"
        );
        return;
      }
      //En caso sea una edicion de comentario
      if (this.esEditar) {
        this.editarComentarioPost(this.comentario);
        return;
      }
      try {
        const response = await agregarComentario(this.$route.params.id, {
          comentario: this.comentario,
        });
        const { msg } = await response.json();
        if (msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "success");
          this.comentario = "";
          this.obtenerComentariosDelPost();
          return;
        }
        this.mostrarAlertaMensaje(
          "No se pudo agregar el comentario",
          "warning"
        );
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error agregando los comentarios del post",
          "error"
        );
      }
    },
    eliminarComentarioPost(id) {
      Swal.fire({
        title: "¿Estas seguro en eliminar el comentario?",
        text: "Se eliminara el comentarios del post",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await eliminarComentario(id);
            const { msg } = await response.json();
            if (msg.includes("exitosamente")) {
              this.mostrarAlertaMensaje(msg, "success");
              this.obtenerComentariosDelPost();
              return;
            }
            this.mostrarAlertaMensaje(
              "No se pudo  eliminar el comentario",
              "warning"
            );
          } catch (error) {
            this.mostrarAlertaMensaje(
              "Ocurrió un error eliminado el comentario",
              "error"
            );
          }
        }
      });
    },
    establecerEditarComentario(comentario) {
      this.esEditar = true;
      this.comentario = comentario.comentario;
      this.comentarioSeleccionado = comentario.id;
    },
    limpiarEdicionComentario() {
      this.esEditar = false;
      this.comentario = "";
      this.comentarioSeleccionado = null;
    },
  },

  created() {
    this.obtenerDatosPost();
    this.obtenerDatosTokenUsuario();
    this.obtenerComentariosDelPost();
  },
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.center {
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
}
.container .post {
  width: 37em;
  height: 36em;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  position: relative;
}
.contenido {
  font-size: 1.5em !important;
}
.container .post:hover .header-post {
  margin-top: -20px;
}
.container .post:hover .cuerpo-post {
  height: 50%;
}
.container .post:hover img {
  transform: translatey(-10px) translatex(-5px) scale(1.05);
}
.container .post .header-post {
  width: 100%;
  height: 40%;
  background: #ddd;
  position: absolute;
  top: 0;
  -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -o-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
}
.container .post .header-post img {
  max-width: 100%;
  height: auto;
  transition: ease-in-out 600ms;
}
.container .post .cuerpo-post {
  width: 100%;
  height: 60%;
  background: #fff;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -o-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  cursor: pointer;
}
.center-boton {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 2em;
}
.boton-editar {
  background: #4482bd;
}
.boton-eliminar {
  background: #ff4d4d;
}
.container .post .cuerpo-post .post-contenido {
  width: 80%;
  height: 80%;
  background: #fff;
  position: relative;
}
.container .post .cuerpo-post .post-contenido h1 {
  font-size: 20px;
  font-weight: bold;
}
.container .post .cuerpo-post .post-contenido p {
  font-size: 14px;
  font-weight: normal;
}
.container .post .cuerpo-post .post-contenido .container_infos {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
  padding-top: 25px;
}
.container .post .cuerpo-post .post-contenido .container_infos .autor {
  display: flex;
  flex-direction: column;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
}
.container .post .cuerpo-post .post-contenido .container_infos .autor span {
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.5;
  letter-spacing: 1px;
  font-weight: bold;
}
.boton-eliminar-comentario {
  position: absolute;
  top: 186%;
  right: 58px;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha {
  display: flex;
  flex-direction: column;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  span {
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.5;
  letter-spacing: 1px;
  font-weight: bold;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  .fecha
  ul {
  display: flex;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  .fecha
  ul
  li {
  font-size: 12px;
  letter-spacing: 2px;
  list-style: none;
  margin-left: 8px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  cursor: pointer;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  .fecha
  ul
  li:first-child {
  margin-left: 0px;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  .fecha
  ul
  li:before {
  content: "";
  text-align: center;
  width: 100%;
  height: 5px;
  background: #fc6042;
  opacity: 0.5;
  position: absolute;
  bottom: 0;
  z-index: -1;
  padding: 0px 1px;
  -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  -o-transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
  transition: cubic-bezier(0.68, -0.55, 0.27, 1.55) 320ms;
}
.container
  .post
  .cuerpo-post
  .post-contenido
  .container_infos
  .contenedor-fecha
  .fecha
  ul
  li:hover:before {
  height: 18px;
}
footer {
  width: 350px;
  height: 80px;
  background: #17a16f;
  position: absolute;
  right: 0;
  bottom: -80px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: top 0.8s forwards;
}
footer span {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #fff;
  font-family: "Poppins";
}
footer span i {
  margin-right: 25px;
  font-size: 22px;
  color: #fff;
  animation: icon 2s forwards;
  opacity: 0;
}
@keyframes top {
  0% {
    opacity: 0;
    bottom: -80px;
  }
  100% {
    opacity: 1;
    bottom: 0px;
  }
}
@keyframes icon {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  50% {
    opacity: 1;
    transform: scale(1.3) rotate(-2deg);
  }
  100% {
    opacity: 1;
    bottom: 0px;
  }
}

.perfil {
  width: 65px;
  height: 65px;
  display: inline-block;
  vertical-align: middle;
}
.perfil img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.bloque-comentario {
  width: 65%;
  height: 100%;
  margin: 0 auto;
  padding: 10px;
  margin-top: 1em;
  margin-bottom: 2em;
}
.bloque-comentario .crear-comentario {
  width: 100%;
  padding: 20px 0;
}
.bloque-comentario .crear-comentario .input-comentario {
  display: inline-block;
  vertical-align: middle;
  margin-left: 10px;
  width: calc(100% - 75px);
}
.bloque-comentario .crear-comentario .input-comentario input[type="text"] {
  width: 100%;
  font-family: "Lato", sans-serif;
  font-weight: 300;
  font-size: 1.3rem;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #f2f2f2;
}
.bloque-comentario
  .crear-comentario
  .input-comentario
  input[type="text"]:focus {
  outline: none;
  border-bottom: 2px solid #e6e6e6;
}
.bloque-comentario .nuevo-comentario {
  width: 100%;
  height: auto;
  padding: 20px 0;
  border-top: 1px solid #e6e6e6;
}
.bloque-comentario .nuevo-comentario .usuario {
  list-style-type: none;
}
.bloque-comentario .nuevo-comentario .cuerpo-comentario {
  display: inline-block;
  vertical-align: middle;
  width: calc(100% - 75px);
  min-height: 65px;
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 0.9rem;
  color: #555;
  background-color: #fff;
  border-bottom: 2px solid #f2f2f2;
}
.bloque-comentario .nuevo-comentario .cuerpo-comentario .responder-a {
  margin: 5px 0px;
  background-color: #fafafa;
  border-bottom: 2px solid #f2f2f2;
  border-radius: 5px;
}
.bloque-comentario .nuevo-comentario .cuerpo-comentario .responder-a p {
  padding: 5px;
}
.bloque-comentario .nuevo-comentario .cuerpo-comentario .responder-a span {
  color: #6495ed;
  margin-right: 2px;
}
.bloque-comentario .nuevo-comentario .comentario-iconos {
  width: 100%;
}
.bloque-comentario .nuevo-comentario .comentario-iconos ul {
  list-style-type: none;
  padding-left: 75px;
  font-size: 0;
}
.bloque-comentario .nuevo-comentario .comentario-iconos ul li {
  display: inline-block;
  padding: 5px;
  font-size: 0.7rem;
  color: #8f8a8a;
}
.bloque-comentario .nuevo-comentario .comentario-iconos ul li:hover {
  cursor: pointer;
}
.bloque-comentario .nuevo-comentario .comentario-iconos .comentario-detalles {
  display: inline-block;
  vertical-align: middle;
  width: 70%;
  text-align: left;
}
.bloque-comentario
  .nuevo-comentario
  .comentario-iconos
  .comentario-herammienta {
  display: inline-block;
  vertical-align: middle;
  width: 30%;
  text-align: right;
}
.bloque-comentario
  .nuevo-comentario
  .comentario-iconos
  .comentario-herammienta
  li:hover {
  color: #ccc;
}
.bloque-comentario .nuevo-comentario .user:hover {
  color: #6495ed;
  text-decoration: underline;
}
.bloque-comentario .nuevo-comentario .love:hover {
  color: #ff6347;
}
.boton-comentario {
  background: #6495ed;
  display: block;
  width: 100%;
  margin-top: 1em;
  margin-bottom: 1em;
}
.boton-comentario-editar {
  background: #40ce97;
  display: block;
  width: 100%;
  margin-top: 1em;
  margin-bottom: 1em;
}
.boton-cancelar {
  background: #ff6347;
  display: block;
  margin-top: 1em;
  margin-bottom: 1em;
  text-align: center;
  margin: 0 auto;
}
</style>