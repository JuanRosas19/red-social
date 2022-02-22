<template>
  <nav class="navbar">
    <div class="logo">
      <img
        class="perfil"
        v-if="foto && foto.length"
        :src="'http://localhost:3000/images/' + foto || 'profile.png'"
        alt="logo"
      />
      Bienvenido {{ nombreUsuario }}
    </div>
    <ul class="nav-links">
      <input type="checkbox" id="checkbox_toggle" />
      <label for="checkbox_toggle" class="hamburger">&#9776;</label>
      <div class="menu">
        <li>
          <router-link to="/">
            <i class="fa-solid fa-table-list"></i> Posts
          </router-link>
        </li>
        <li>
          <router-link to="/usuarios"
            ><i class="fa-solid fa-users"></i> Usuarios</router-link
          >
        </li>
        <li class="dropdown-contenedor">
          <a> <i class="fa-solid fa-user-gear"></i> Configuracion</a>
          <ul class="dropdown">
            <li @click="$router.push('/actualizar-perfil')">
              <a> <i class="fa-solid fa-user-pen"></i> Modificar perfil </a>
            </li>
            <li @click="$router.push('/actualizar-clave')">
              <a></a> <i class="fa-solid fa-key"></i> Actualizar clave
            </li>
            <li>
              <a @click="cerrarSesion"
                ><i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión</a
              >
            </li>
            <li @click="eliminarCuenta" class="warning">
              <a><i class="fa-solid fa-user-slash"></i> Eliminar cuenta</a>
            </li>
          </ul>
        </li>
        <li>
          <router-link to="/solicitudes"
            ><i class="fa-solid fa-user-plus"></i> Solicitudes</router-link
          >
        </li>
        <li>
          <router-link to="/amigos"
            ><i class="fa-solid fa-users-gear"></i> Amigos</router-link
          >
        </li>
      </div>
    </ul>
  </nav>
</template>

<script>
import { obtenerPerfil, eliminarPerfil } from "../servicios/usuarios";
import Swal from "sweetalert2";
export default {
  name: "Navbar",
  data() {
    return {
      nombreUsuario: "",
      foto: "",
    };
  },
  methods: {
    cerrarSesion() {
      localStorage.removeItem("token");
      window.location.href = "/";
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
    eliminarCuenta() {
      Swal.fire({
        title:
          "¿Estas seguro en eliminar la cuenta del usuario " +
          this.nombreUsuario +
          "?",
        text: "Al eliminar su cuenta se eliminaran todos sus datos relacionados",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Si, eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await eliminarPerfil();
            const { msg } = await response.json();
            if (msg.includes("exitosamente")) {
              this.mostrarAlertaMensaje(msg, "success");
              setTimeout(() => {
                this.cerrarSesion();
              }, 1000);
              return;
            }
            this.mostrarAlertaMensaje(
              "No se pudo eliminar el usuario",
              "warning"
            );
          } catch (error) {
            this.mostrarAlertaMensaje(
              "Ocurrió un error eliminado el usuario",
              "error"
            );
          }
        }
      });
    },
  },
  async created() {
    try {
      const response = await obtenerPerfil();
      const { usuario } = await response.json();
      this.nombreUsuario = usuario[0].nombre;
      this.foto = usuario[0].foto;
    } catch (error) {
      this.mostrarAlertaMensaje(
        "Ocurrió un error obteniendo los datos del usuario",
        "error"
      );
    }
  },
};
</script>

<style>
.perfil {
  width: 3em;
  height: 3em;
  margin-bottom: -1em;
  border-radius: 6em;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: cursive;
  background: #eee;
}
a {
  text-decoration: none;
}
li {
  list-style: none;
}
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #1877f2;
  color: #fff;
}
.nav-links a {
  color: #fff;
}
.warning {
  background: #fd6161;
  border-radius: 3em;
}
.logo {
  font-size: 20px;
}
.menu {
  display: flex;
  gap: 1em;
  font-size: 18px;
}
.menu li:hover {
  background-color: #2454bb;
  border-radius: 5px;
  transition: 0.3s ease;
}
.menu li {
  padding: 5px 14px;
}
.dropdown-contenedor {
  position: relative;
}
.dropdown {
  background-color: #0c5a96;
  padding: 1em 0;
  position: absolute;
  display: none;
  border-radius: 8px;
  top: 35px;
}
.dropdown li + li {
  margin-top: 10px;
}
.dropdown li {
  padding: 0.5em 1em;
  width: 8em;
  text-align: center;
}
.dropdown li:hover {
  background-color: #2454bb;
}
.dropdown-contenedor:hover .dropdown {
  display: block;
}
input[type="checkbox"] {
  display: none;
}
.hamburger {
  display: none;
  font-size: 24px;
  user-select: none;
}
@media (max-width: 768px) {
  .menu {
    display: none;
    position: absolute;
    background-color: #1877f2;
    right: 0;
    left: 0;
    text-align: center;
    padding: 16px 0;
    margin-top: 1em;
  }
  .menu li:hover {
    display: inline-block;
    background-color: #2454bb;
    transition: 0.3s ease;
  }
  .menu li + li {
    margin-top: 12px;
  }
  input[type="checkbox"]:checked ~ .menu {
    display: block;
  }
  .hamburger {
    display: block;
  }
  .dropdown {
    left: 50%;
    top: 30px;
    transform: translateX(35%);
  }
  .dropdown li:hover {
    background-color: #2454bb;
  }
}
</style>