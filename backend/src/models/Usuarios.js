const Sequelize = require('sequelize');
const db = require('../config/database');
const Usuarios = db.define('usuarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El nombre es requerido',
      },
    },
  },
  sexo: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El sexo es requerido',
      },
    },
  },
  usuario: {
    type: Sequelize.STRING,
    unique: {
      msg: 'El usuario ya existe',
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El usuario es requerido',
      },
    },
  },
  clave: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La clave es requerida',
      },
    },
  },
  creado_el: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  fecha_nacimiento: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha de nacimiento es requerida',
      },
    },
  },
  foto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Usuarios;
