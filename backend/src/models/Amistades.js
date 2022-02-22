const Sequelize = require('sequelize');
const db = require('../config/database');
const Usuarios = require('./Usuarios');

const Amistades = db.define('amistades', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  usuario_solicita_id: {
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
  estado: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      notEmpty: {
        msg: 'El estado es requerido',
      },
    },
  },
  fecha: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
  },
});
module.exports = Amistades;
