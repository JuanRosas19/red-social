const Sequelize = require('sequelize');
const db = require('../config/database');
const Usuarios = require('./Usuarios');
const Posts = require('./Posts');
const Comentarios = db.define('comentarios', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  comentario: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El comentario es requerido',
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
  post_id: {
    type: Sequelize.INTEGER,
    references: {
      model: Posts,
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'El post es requerido',
      },
    },
  },
});
module.exports = Comentarios;
