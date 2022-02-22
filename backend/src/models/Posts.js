const Sequelize = require('sequelize');
const db = require('../config/database');
const Usuarios = require('./Usuarios');

const Posts = db.define('posts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contenido: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El contenido es requerido',
      },
    },
  },
  fecha: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'La fecha es requerida',
      },
    },
  },
  foto: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      notEmpty: {
        msg: 'La foto es requerida',
      },
    },
  },
  usuario_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Usuarios,
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El usuario es requerido',
      },
    },
  },
});

module.exports = Posts;
