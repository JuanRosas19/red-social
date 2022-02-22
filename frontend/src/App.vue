<template>
  <div>
    <Navbar v-if="mostrarNavbar" />
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
export default {
  components: {
    Navbar,
  },
  data() {
    return {
      mostrarNavbar: false,
    };
  },
  created() {
    if (localStorage.getItem("token")) {
      this.mostrarNavbar = true;
    }
  },
};
</script>
<style>
* {
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
}
.boton {
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4em;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
  text-align: center;
}
.btn-regresar {
  position: absolute;
  top: 16%;
  left: 6em;
  border-radius: 6em !important;
  padding: 0.5em;
  background: #11717a;
  cursor: pointer;
  color: #fff;
  border: none;
  padding: 1em 3em;
}
.btn-regresar:hover {
  background: #26b5c2;
  transition: 1s all;
}

.gray {
  color: #8c8c8c;
}
@media screen and (max-width: 400px) {
  .btn-regresar {
    display: none;
  }
}
</style>
