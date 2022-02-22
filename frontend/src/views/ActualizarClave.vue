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
      Actualizar clave de tu cuenta <i class="fa-solid fa-key"></i>
    </h1>
    <div class="formulario">
      <div class="formulario-panel cambiar-clave">
        <div class="formulario-header">
          <h1 class="center">Ingregar contraseñas</h1>
          <p class="gray center">
            Debes ingregar la contraseña actual para poder cambiar de clave
          </p>
        </div>
        <div>
          <form @submit.prevent="actualizarClaveUsuario">
            <div class="formulario-container">
              <label for="clave-actual">Contraseña actual</label>
              <input
                type="password"
                id="clave-actual"
                name="clave-actual"
                placeholder="Contraseña actual"
                v-model.trim="claves.claveActual"
                required
              />
            </div>
            <div class="formulario-container">
              <label for="clave-nueva"> Nueva contraseña </label>
              <input
                type="password"
                id="clave-nueva"
                name="clave-nueva"
                placeholder="Contraseña nueva"
                v-model.trim="claves.claveNueva"
                required
              />
            </div>
            <div class="formulario-container">
              <button type="submit">
                Cambiar clave <i class="fa-solid fa-lock"></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { actualizarClave } from "../servicios/usuarios/index";
export default {
  name: "ActualizarClave",
  data() {
    return {
      claves: {
        claveActual: "",
        claveNueva: "",
      },
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
    async actualizarClaveUsuario() {
      if (this.claves.claveActual === "" || this.claves.claveNueva === "") {
        this.mostrarAlertaMensaje("Debes ingresar las claves", "warning");
        return;
      }
      if (
        this.claves.claveActual.length < 6 ||
        this.claves.claveNueva.length < 6
      ) {
        this.mostrarAlertaMensaje(
          "Las claves deben tener minimo 6 caracteres",
          "warning"
        );
        return;
      }
      if (this.claves.claveNueva === this.claves.claveActual) {
        this.mostrarAlertaMensaje(
          "La nueva clave no puede ser igual a la actual",
          "warning"
        );
        return;
      }
      try {
        const response = await actualizarClave({
          claveAnterior: this.claves.claveActual,
          nuevaClave: this.claves.claveNueva,
        });
        const { msg } = await response.json();
        if (msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(msg, "success");
          this.claves.claveActual = "";
          this.claves.claveNueva = "";
          return;
        }
        this.mostrarAlertaMensaje(msg, "warning");
      } catch (error) {
        this.mostrarAlertaMensaje(
          "Ocurrió un error actualizando la clave",
          "error"
        );
      }
    },
  },
};
</script>

<style scoped>
.formulario-panel.cambiar-clave:before {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
}
.formulario {
  z-index: 15;
  position: relative;
  background: #ffffff;
  width: 600px;
  border-radius: 4px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 100px auto 10px;
  overflow: hidden;
  margin-bottom: 2em;
}
.formulario-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 0 20px;
}
.formulario-container:last-child {
  margin: 0;
}
.center {
  text-align: center;
  margin-bottom: 1em;
  margin-top: 1em;
}
.formulario-container label {
  display: block;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.6);
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.2em;
}

.formulario-container input {
  outline: none;
  display: block;
  background: rgba(0, 0, 0, 0.1);
  width: 100%;
  border: 0;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 12px 20px;
  color: rgba(0, 0, 0, 0.6);
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  transition: 0.3s ease;
}
.formulario-container input:focus {
  color: rgba(0, 0, 0, 0.8);
}

.formulario-container button {
  outline: none;
  background: #4285f4;
  width: 100%;
  border: 0;
  border-radius: 3em;
  padding: 12px 20px;
  color: #ffffff;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
  line-height: inherit;
  text-transform: uppercase;
  cursor: pointer;
}
.formulario-container button:hover {
  background: #3c5a99;
  transition: 0.3s ease-in all;
}
.formulario-container .formulario-remember {
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
}
.formulario-container .formulario-remember input[type="checkbox"] {
  display: inline-block;
  width: auto;
  margin: 0 10px 0 0;
}
.formulario-container .formulario-recovery {
  color: #4285f4;
  font-size: 12px;
  text-decoration: none;
}
.formulario-panel {
  padding: 60px calc(5% + 60px) 60px 60px;
  box-sizing: border-box;
}
.formulario-panel.cambiar-clave:before {
  content: "";
  display: block;
  opacity: 0;
  visibility: hidden;
  transition: 0.3s ease;
}
.formulario-panel.cambiar-clave.hidden:before {
  display: block;
  opacity: 1;
  visibility: visible;
}
.formulario-header {
  margin: 0 0 40px;
}
.formulario-header h1 {
  padding: 4px 0;
  color: #4285f4;
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
}
@media screen and (max-width: 767px) {
  .formulario {
    width: 95%;
  }
  .formulario-panel {
    padding: 60px 20px 60px 20px;
  }
}
</style>