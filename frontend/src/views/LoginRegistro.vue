<template>
  <link
    href="https://fonts.googleapis.com/css?family=Open+Sans:400,700"
    rel="stylesheet"
    type="text/css"
  />
  <div id="navbar-login">
    <div id="navbar">
      <table class="tabla">
        <tr>
          <td class="fila-1"><label for="Usuario">Usuario</label></td>
          <td class="fila-1"><label for="Clave">Clave</label></td>
        </tr>
        <tr>
          <td>
            <input
              v-model.trim="login.usuario"
              id="Usuario"
              type="email"
              required
              class="input"
              placeholder="Ingresar usuario"
            />
          </td>
          <td>
            <input
              v-model.trim="login.clave"
              id="Clave"
              type="password"
              required
              class="input"
              placeholder="Ingresar clave"
            />
          </td>
          <td>
            <button @click="loguearUsuario" id="boton-login">
              Iniciar sesión
            </button>
          </td>
        </tr>
      </table>

      <h1 class="logo-navbar">Actividad III</h1>
    </div>
  </div>

  <div id="contenido-navbar center" style="text-align: center">
    <div id="contenido">
      <div id="contenido-registro">
        <div class="registro font-bold">Registrate</div>
        <div class="subtitulo font-bold">
          Completa los campos solicitados para crear una cuenta
        </div>

        <div class="contenedor-formulario">
          <input
            type="text"
            class="input-text input-1"
            placeholder="Nombre"
            v-model.trim="registro.nombre"
          />
          <input
            v-model.trim="registro.usuario"
            type="email"
            class="input-text input-1 float-right"
            placeholder="Usuario"
          />
        </div>
        <div class="contenedor-formulario">
          <input
            v-model="registro.clave"
            type="password"
            class="input-text input-2"
            placeholder="Ingresas clave"
          />
        </div>
        <div class="contenedor-formulario">
          <input
            v-model="registro.repetirClave"
            type="password"
            class="input-text input-2"
            placeholder="Repetir clave"
          />
        </div>
        <div class="contenedor-formulario">
          <div class="fecha-cumpleaños">Fecha de cumplaños</div>
        </div>
        <div class="contenedor-formulario">
          <span data-type="selectors" class="cumpleaños">
            <span>
              <select
                v-model="registro.mes"
                title="Mes"
                class="select-cumpleaños"
              >
                <option value="" selected disabled>Mes</option>
                <option v-for="mes in meses" :key="mes" :value="mes">
                  {{ mes }}
                </option>
              </select>
              <select
                v-model="registro.dia"
                title="Dia"
                class="select-cumpleaños float-left"
              >
                <option value="" selected disabled>Día</option>
                <option v-for="dia in dias" :key="dia" :value="dia">
                  {{ dia }}
                </option>
              </select>
              <select
                v-model="registro.año"
                title="Año"
                class="select-cumpleaños float-left"
              >
                <option value="" selected="" disabled>Año</option>
                <option v-for="año in años" :value="año" :key="año">
                  {{ año }}
                </option>
              </select>
            </span>
          </span>
        </div>
        <div class="contenedor-formulario margin-top">
          <span data-type="radio" class="padding">
            <input
              v-model="registro.sexo"
              type="radio"
              id="femenino"
              value="Femenino"
              class="margin-0"
            />
            <label for="femenino" class="genero">Femenino </label>
            <input
              v-model="registro.sexo"
              value="Masculino"
              type="radio"
              id="masculino"
              class="margin-0"
            />
            <label for="masculino" value="Masculino" class="genero"
              >Masculino
            </label>
          </span>
        </div>
        <div class="contenedor-formulario">
          <button
            @click="registrarUsuario"
            type="submit"
            class="boton-registro font-bold"
          >
            Crear cuenta <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
import { dias, meses, años } from "../constantes/main";
import { loginUsuario, registroUsuario } from "../servicios/usuarios";
export default {
  name: "LoginRegistro",
  data() {
    return {
      dias,
      meses,
      años,
      registro: {
        nombre: "",
        usuario: "",
        clave: "",
        repetirClave: "",
        sexo: "",
        año: "",
        mes: "",
        dia: "",
      },
      login: {
        usuario: "",
        clave: "",
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
    async registrarUsuario() {
      if (
        (!this.registro.nombre ||
          !this.registro.usuario ||
          !this.registro.clave ||
          !this.registro.repetirClave,
        !this.registro.sexo ||
          !this.registro.año ||
          !this.registro.dia ||
          !this.registro.mes)
      ) {
        return this.mostrarAlertaMensaje(
          "Todos los datos son requeridos.",
          "warning"
        );
      }
      if (!this.registro.usuario.includes("@")) {
        return this.mostrarAlertaMensaje(
          "El usuario debe ser un correo electrónico.",
          "warning"
        );
      }
      if (this.registro.clave.length < 6) {
        return this.mostrarAlertaMensaje(
          "La clave debe tener minímo 6 caracteres.",
          "warning"
        );
      }
      if (this.registro.clave !== this.registro.repetirClave) {
        return this.mostrarAlertaMensaje(
          "Las claves debe ser iguales",
          "warning"
        );
      }
      const { nombre, usuario, clave, sexo, año, mes, dia } = this.registro;
      const fecha_nacimiento = `${año}-${mes}-${dia}`;
      const datos = {
        nombre,
        usuario,
        clave,
        sexo,
        fecha_nacimiento,
      };
      try {
        const response = await registroUsuario(datos);
        const respuesta = await response.json();
        if (respuesta.msg.includes("exitosamente")) {
          this.mostrarAlertaMensaje(respuesta.msg, "success");
          this.registro = {
            nombre: "",
            usuario: "",
            clave: "",
            repetirClave: "",
            sexo: "",
            año: "",
            mes: "",
            dia: "",
          };
          return;
        }
        this.mostrarAlertaMensaje(respuesta.msg, "warning");
      } catch (error) {
        this.mostrarAlertaMensaje(error.response.data.msg, "error");
      }
    },
    async loguearUsuario() {
      if (!this.login.usuario || !this.login.clave) {
        return this.mostrarAlertaMensaje(
          "Todos los datos son requeridos.",
          "warning"
        );
      }
      if (!this.login.usuario.includes("@")) {
        return this.mostrarAlertaMensaje(
          "El usuario debe ser un correo electrónico.",
          "warning"
        );
      }
      if (this.login.clave.length < 6) {
        return this.mostrarAlertaMensaje(
          "La clave debe tener minímo 6 caracteres.",
          "warning"
        );
      }
      try {
        const respuesta = await loginUsuario(this.login);
        const respuestaJson = await respuesta.json();
        if (!respuestaJson.msg.includes("Usuario logueado exitosamente")) {
          return this.mostrarAlertaMensaje(respuestaJson.msg, "warning");
        }
        this.mostrarAlertaMensaje(respuestaJson.msg, "success");
        this.login = {
          usuario: "",
          clave: "",
        };
        localStorage.setItem("token", respuestaJson.token);
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        this.mostrarAlertaMensaje(error.response.msg, "error");
      }
    },
  },
};
</script>

<style scoped>
body {
  margin: 0;
  font-family: "Lucida Grande", tahoma, verdana, arial, sans-serif;
  line-height: 1.28;
}

#navbar-login {
  width: 100%;
  height: 82px;
  background-color: #1877f2;
}

#navbar {
  margin: 0 auto;
  width: 980px;
  height: 59px;
}

#contenido-navbar {
  width: 100%;
  height: 606px;
  background-color: #edf0f5;
}

#contenido {
  margin: 0 auto;
  width: 980px;
  padding-top: 20px;
}

h1 {
  font-family: tahoma, verdana, arial, sans-serif;
  font-size: 38px;
  letter-spacing: 0.05px;
  margin: 0;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}

.logo-navbar {
  display: block;
  padding: 30px 0;
}

#boton-login {
  position: relative;
  width: 83px;
  height: 18px;
  background-color: #1d6acf;
  border: 1px solid #999;
  border-color: #8b9dc3 #2f477a #29447e #1a356e;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  text-align: center;
  color: #fff;
}
#boton-login:hover {
  background: #1877f2;
  transition: 0.5s ease-in all;
}

.tabla {
  float: right;
  margin-top: 15px;
}

.fila-1 {
  color: #fff;
  font-size: 11px;
  width: 164px;
  cursor: pointer;
}

.input {
  border-color: #1d2a5b;
  margin: 0;
  width: 142px;
  border: 1px solid #bdc7d8;
  margin: 0;
  padding: 3px;
}

.titulo-1 {
  display: inline-block;
  vertical-align: middle;
}

#contenido-registro {
  display: inline-block;
  vertical-align: top;
  height: 526px;
  align-items: center;
  background-color: #fff;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 40px 0 0;
  padding: 20px 0 28px;
  width: 449px;
}

.registro {
  font-size: 36px;
  -webkit-font-smoothing: antialiased;
  font-weight: 700;
  margin-bottom: 5px;
}

.font-bold {
  font-family: "Open Sans", sans-serif;
  text-rendering: optimizelegibility;
  color: #333;
}
.center {
  text-align: center !important;
}
.subtitulo {
  font-size: 19px;
  margin-bottom: 20px;
}

.contenedor-formulario {
  display: inline-block;
  width: 399px;
}
.cumpleaños {
  display: flex;
  justify-content: center;
}

.input-text {
  display: inline-block;
  font-size: 18px;
  padding: 8px 10px;
  border: 1px solid #bdc7d8;
  color: #333;
  margin-bottom: 10px;
}

::-webkit-input-placeholder {
  color: #999;
}

::-moz-placeholder {
  color: #999;
}

:-ms-input-placeholder {
  color: #999;
}

.input-1 {
  width: 190px;
}

.input-2 {
  width: 377px;
}

.float-right {
  float: right;
}

.float-left {
  float: left;
}

.fecha-cumpleaños {
  font-size: 19px;
  color: #141823;
  -webkit-font-smoothing: antialiased;
  margin-bottom: 5px;
}

.select-cumpleaños {
  display: inline-block;
  height: 30px;
  font-size: 13px;
  border: 1px solid #bdc7d8;
  color: #141823;
}

.parrafo {
  font-size: 11px;
  color: #1877f2;
  width: 150px;
  margin-left: 10px;
  cursor: pointer;
}

.underline:hover {
  text-decoration: underline;
}

.genero {
  font-size: 18px;
  color: #141823;
  cursor: pointer;
  padding: 0 10px 0 3px;
  margin-right: 4px;
  line-height: 18px;
  vertical-align: middle;
}

.padding {
  padding: 5px 0 5px 4px;
  display: inline-block;
}

.margin-top {
  margin-top: 15px;
}

.margin-0 {
  margin: 0;
}

.boton-registro {
  font-weight: 700;
  letter-spacing: 1px;
  color: #fff;
  min-width: 194px;
  text-align: center;
  background: #42b72a;
  border: none;
  margin-top: 10px;
  margin-bottom: 10px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  border-radius: 6px;
  font-size: 17px;
  line-height: 48px;
  padding: 0 16px;
}

.boton-registro:hover {
  background: #39a822;
}
@media screen and (max-width: 980px) {
  .float-right {
    float: none;
  }
  #contenido {
    width: 100%;
  }
  #contenido-registro {
    width: 405px;
  }
  .contenedor-formulario {
    display: inline-block;
    width: 13em;
  }

  .input-2,
  .input-1 {
    width: 167px;
  }
  #contenido-registro {
    height: 600px;
  }
  .padding {
    margin: 1em;
    padding: 27px;
  }
}
@media (max-width: 975px) {
  .fila-1 {
    display: none;
  }
  #navbar {
    position: absolute;
    right: 0;
    left: 0;
    text-align: center;
    padding: 16px 0;
  }
  #navbar {
    left: 0;
    padding-bottom: 6em;
    width: 10em;
  }
  .tabla {
    display: flex;
    margin: 0 auto;
    justify-content: center !important;
    text-align: center;
    float: initial;
  }
  #navbar h1 {
    display: none;
  }
  #navbar td + td {
    margin-top: 12px;
  }
}
</style>