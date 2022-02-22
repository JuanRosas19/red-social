<template>
  <div>
    <h1 class="titulo">
      Listado de publicaciones <i class="fa-solid fa-table-list"></i>
    </h1>
    <div class="center-boton">
      <button @click="$router.push('/crear-post')" class="boton boton-agregar">
        Nueva publicación <i class="fa-solid fa-earth-europe"></i>
      </button>
      <button @click="obtenerListadoPost" class="boton boton-actualizar">
        Actualizar posts <i class="fa-solid fa-arrow-rotate-left"></i>
      </button>
    </div>
    <div class="container">
      <template v-if="posts.length">
        <div v-for="post in posts" :key="post.id">
          <div class="post">
            <div class="img">
              <img :src="'http://localhost:3000/images/' + post.foto" />
            </div>
            <div class="bottom-text">
              <div class="text">
                {{ post.contenido }}
              </div>
              <div class="btn">
                <router-link :to="'/detalles-post/' + post.id"
                  >Detalles <span>&rarr;</span></router-link
                >
              </div>
            </div>
            <div class="underline"></div>
            <div class="datos-post">
              <div class="">
                <p class="icon-color" style="text-align: center">
                  <img
                    width="25"
                    style="border-radius: 4em"
                    height="25"
                    :src="
                      'http://localhost:3000/images/' + post.usuario_id.foto
                    "
                    alt="foto-perfil"
                  />
                </p>
                <span class="gray mt">{{ post.usuario_id.nombre }}</span>
              </div>
              <div class="">
                <p class="icon-color" style="text-align: center">
                  <i class="fa-solid fa-calendar"></i>
                </p>
                <p class="gray mt">{{ post.fecha.substring(0, 10) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="texto-centrado">
          <p class="gray">
            No existen publicaciones registradas actualmente
            <i class="fa-solid fa-folder-open"></i>
          </p>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { obtenerPosts } from "../servicios/posts/index";
export default {
  name: "Main",
  data() {
    return {
      posts: [],
    };
  },
  created() {
    this.obtenerListadoPost();
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
    async obtenerListadoPost() {
      try {
        const response = await obtenerPosts();
        const { posts } = await response.json();
        this.posts = posts;
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ha ocurrido un error obteniendo los posts",
          "error"
        );
      }
    },
  },
};
</script>
<style scoped>
body {
  height: 100%;
  display: grid;
  place-items: center;
  background: #f2f2f2;
  text-align: center;
}
.container {
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2em;
  flex-wrap: wrap;
}
.texto-centrado {
  display: flex;
  justify-content: center !important;
  margin: 0 auto;
}
.post {
  height: 428px;
  max-width: 350px;
  margin: 0 20px;
  background: white;
  transition: 0.4s;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  opacity: 1;
  visibility: visible;
  margin-bottom: 2em;
}

.post .img {
  height: 200px;
  width: 100%;
}
.post .img img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}
.post .top-text {
  padding: 5px;
}
.post .top-text .name {
  font-size: 25px;
  font-weight: 600;
  color: #202020;
}
.post .top-text p {
  font-size: 20px;
  font-weight: 600;
  color: #e74c3c;
  line-height: 20px;
}
.post .bottom-text {
  padding: 0 20px 10px 20px;
  margin-top: 5px;
  background: white;
  transition: 0.1s;
}
.post:hover .bottom-text {
  opacity: 1;
  visibility: visible;
}
.post .bottom-text .text {
  margin: 1em;
  text-align: center;
}
.post .bottom-text .btn {
  margin: 10px 0;
  text-align: left;
}
.post .bottom-text .btn a {
  display: block;
  width: 100%;
  padding: 1.5rem;
  font-size: 1rem;
  text-align: center;
  color: #3363ff;
  background-color: #e6ecff;
  border: none;
  border-radius: 0.4rem;
  transition: 0.2s;
  cursor: pointer;
}
.post .bottom-text .btn a:hover {
  transform: scale(0.9);
}
@media screen and (max-width: 978px) {
  .container {
    flex-wrap: wrap;
    flex-direction: column;
  }
  .post {
    max-width: 700px;
    margin: 20px 0;
  }
}
.center {
  text-align: center;
}
.titulo {
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
}

.boton-agregar {
  background: #3363ff;
}
.boton-actualizar {
  background: #084491;
}
.center-boton {
  display: flex;
  justify-content: space-evenly;
  margin-bottom: 2em;
}
.datos-post {
  display: flex;
  justify-content: space-around;
  margin-bottom: 2em;
  margin-top: 2em;
}
.underline {
  width: 90%;
  height: 2px;
  background: #dedfe3;
  margin-top: 2em;
  text-align: center;
  margin: 0 auto;
}
.mt {
  margin-bottom: 1em;
}
.icon-color {
  color: #1877f2;
}
</style>
