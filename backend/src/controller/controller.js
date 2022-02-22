const Usuarios = require('../models/Usuarios');
const Posts = require('../models/Posts');
const Comentarios = require('../models/Comentarios');
const Amistades = require('../models/Amistades');
const { compararClave, hasClave } = require('../utils/password');
const { crearToken } = require('../utils/token');
const { Op } = require('sequelize');
require('dotenv').config();
const registrarUsuarios = async (req, res) => {
  try {
    const { nombre, sexo, usuario, clave, fecha_nacimiento } = req.body;
    if (clave.length < 6) {
      return res.status(400).json({
        msg: 'La contraseña debe tener al menos 6 caracteres',
      });
    }
    const usuarioRegistrado = await Usuarios.findAll({
      where: {
        usuario,
      },
    });
    if (usuarioRegistrado.length) {
      return res.status(400).json({
        msg: 'El usuario ya se encuentra registrado',
      });
    }
    const nuevoUsuario = await Usuarios.create({
      nombre,
      sexo,
      usuario,
      clave: await hasClave(clave),
      fecha_nacimiento,
      foto: 'profile.png',
    });
    if (nuevoUsuario) {
      return res.status(201).json({ msg: 'Usuario registrado exitosamente.' });
    }
    res.status(400).json({ msg: 'No se pudo registrar el usuario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const loginUsuario = async (req, res) => {
  try {
    const { usuario, clave } = req.body;
    const usuarioLogin = await Usuarios.findAll({
      where: {
        usuario,
      },
    });
    if (!usuarioLogin.length) {
      return res
        .status(500)
        .json({ msg: 'El usuario no se encuentra registrado' });
    }
    const resultado = await compararClave(clave, usuarioLogin[0].clave);
    if (!resultado) {
      return res.status(500).json({ msg: 'La contraseña es incorrecta' });
    }
    const token = crearToken(
      {
        id: usuarioLogin[0].id,
        usuario: usuarioLogin[0].usuario,
        nombre: usuarioLogin[0].nombre,
        foto: usuarioLogin[0].foto,
      },
      process.env.SECRET
    );
    res.status(200).json({ msg: 'Usuario logueado exitosamente', token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuarios.findAll();
    const usuariosConCampos = await Promise.all(
      usuarios.map(async (usuario) => {
        usuario.clave = null;
        const cantidadPost = await Posts.count({
          where: {
            usuario_id: usuario.id,
          },
        });
        const cantidadComentarios = await Comentarios.count({
          where: {
            usuario_id: usuario.id,
          },
        });
        return {
          ...usuario.dataValues,
          cantidadPost: cantidadPost,
          cantidadComentarios: cantidadComentarios,
        };
      })
    );
    const usuariosObtenidos = usuariosConCampos.filter(
      (usuario) => usuario.id !== req.usuario.id
    );
    return res.status(200).json({ usuarios: usuariosObtenidos });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerPerfil = async (req, res) => {
  try {
    let usuario = await Usuarios.findAll({
      where: {
        id: req.usuario.id,
      },
    });
    const post = await Posts.count({
      where: {
        usuario_id: req.usuario.id,
      },
    });
    const comentarios = await Comentarios.count({
      where: {
        usuario_id: req.usuario.id,
      },
    });
    if (!usuario.length) {
      return res.status(400).json({ msg: 'El usuario no existe' });
    }
    usuario[0].clave = null;
    return res
      .status(200)
      .json({ usuario, cantidadPost: post, cantidadComentarios: comentarios });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const modificarPerfil = async (req, res) => {
  try {
    const { nombre, sexo, fecha_nacimiento, usuario } = req.body;
    //Valida que no exista un usuario con el mismo usuario y que no sea el usuario actual, solo en el caso de que se modifique el usuario
    const [usuarioModificar] = await Usuarios.findAll({
      where: {
        id: req.usuario.id,
      },
    });
    if (usuarioModificar.usuario !== usuario) {
      try {
        const usuarioModificado = await Usuarios.findAll({
          where: {
            usuario,
            id: { [Op.ne]: req.usuario.id },
          },
        });
        if (usuarioModificado.length) {
          return res.status(400).json({
            msg: 'El usuario ya se encuentra registrado',
          });
        }
      } catch (error) {
        res.status(500).json({ msg: error });
      }
    }
    //Validar que la foto sea una imagen
    if (req.file) {
      if (req.file.mimetype.split('/')[0] !== 'image') {
        return res.status(400).json({
          msg: 'El archivo no es una imagen',
        });
      }
    }
    const usuarioModificado = await Usuarios.update(
      {
        nombre,
        sexo,
        fecha_nacimiento,
        usuario,
        foto:
          req.file && req.file.filename
            ? req.file.filename
            : usuarioModificar.foto, //Si no se modifica la foto, se mantiene la misma
      },
      {
        where: {
          id: req.usuario.id,
        },
      }
    );
    if (usuarioModificado) {
      return res.status(200).json({ msg: 'Usuario modificado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo modificar el usuario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const modificarClave = async (req, res) => {
  try {
    const { nuevaClave, claveAnterior } = req.body;
    const usuarioModificar = await Usuarios.findAll({
      where: {
        id: req.usuario.id,
      },
    });
    if (!usuarioModificar.length) {
      return res
        .status(400)
        .json({ msg: 'El usuario no se encuentra registrado' });
    }
    const resultado = await compararClave(
      claveAnterior,
      usuarioModificar[0].clave
    );
    if (!resultado) {
      return res
        .status(400)
        .json({ msg: 'La contraseña actual no es la correcta' });
    }
    const usuarioModificarClave = await Usuarios.update(
      {
        clave: await hasClave(nuevaClave),
      },
      {
        where: {
          id: req.usuario.id,
        },
      }
    );
    if (usuarioModificarClave) {
      return res
        .status(200)
        .json({ msg: 'Contraseña modificada exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo modificar la contraseña' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const eliminarPerfil = async (req, res) => {
  try {
     await Posts.destroy({
      where: {
        usuario_id: req.usuario.id,
      },
    });
     await Comentarios.destroy({
      where: {
        usuario_id: req.usuario.id,
      },
    });
    const usuarioEliminado = await Usuarios.destroy({
      where: {
        id: req.usuario.id,
      },
    });
    if (usuarioEliminado) {
      return res.status(200).json({ msg: 'Usuario eliminado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el usuario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerPostUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const posts = await Posts.findAll({
      where: {
        id_usuario: usuarioId,
      },
    });
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerPosts = async (req, res) => {
  try {
    const posts = await Posts.findAll();
    const postsPopulados = await Promise.all(
      posts.map(async (post) => {
        const usuario = await Usuarios.findOne({
          where: {
            id: post.usuario_id,
          },
        });
        return {
          ...post.dataValues,
          usuario_id: {
            id: usuario.id,
            usuario: usuario.usuario,
            nombre: usuario.nombre,
            foto: usuario.foto,
          },
        };
      })
    );
    res.status(200).json({ posts: postsPopulados });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const crearPost = async (req, res) => {
  try {
    const { contenido } = req.body;
    const nuevoPost = await Posts.create({
      usuario_id: req.usuario.id,
      contenido,
      foto:
        req.file && req.file.filename ? req.file.filename : 'placeholder.jpg',
    });
    if (nuevoPost) {
      return res.status(200).json({ msg: 'Post creado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo crear el post' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Posts.findAll({
      where: {
        id: postId,
      },
    });
    const usuario = await Usuarios.findOne({
      where: {
        id: post[0].usuario_id,
      },
    });
    const postPopulado = {
      ...post[0].dataValues,
      usuario_id: {
        id: usuario.id,
        usuario: usuario.usuario,
        nombre: usuario.nombre,
        foto: usuario.foto,
      },
    };
    res.status(200).json({ post: postPopulado });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const modificarPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { contenido } = req.body;
    const postModificado = await Posts.update(
      {
        contenido,
      },
      {
        where: {
          id: postId,
        },
      }
    );
    if (postModificado) {
      return res.status(200).json({ msg: 'Post modificado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo modificar el post' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const eliminarPost = async (req, res) => {
  try {
    const { postId } = req.params;
    //En caso existan comentarios, se eliminan
      await Comentarios.destroy({
      where: {
        post_id: postId,
      },
    });
    const postEliminado = await Posts.destroy({
      where: {
        id: postId,
      },
    });
    if (postEliminado) {
      return res.status(200).json({ msg: 'Post eliminado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el post' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerComentarios = async (req, res) => {
  try {
    const { postId } = req.params;
    const comentarios = await Comentarios.findAll({
      where: {
        post_id: postId,
      },
    });
    const comentariosPopulados = await Promise.all(
      comentarios.map(async (comentario) => {
        const usuario = await Usuarios.findOne({
          where: {
            id: comentario.usuario_id,
          },
        });
        return {
          ...comentario.dataValues,
          usuario_id: {
            id: usuario.id,
            usuario: usuario.usuario,
            nombre: usuario.nombre,
            foto: usuario.foto,
          },
        };
      })
    );
    res.status(200).json({ comentarios: comentariosPopulados });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const crearComentario = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comentario } = req.body;
    const nuevoComentario = await Comentarios.create({
      post_id: postId,
      usuario_id: req.usuario.id,
      comentario,
    });
    if (nuevoComentario) {
      return res.status(200).json({ msg: 'Comentario creado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo crear el comentario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const modificarComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const { comentario } = req.body;
    const comentarioModificado = await Comentarios.update(
      {
        comentario,
      },
      {
        where: {
          id: comentarioId,
        },
      }
    );
    if (comentarioModificado) {
      return res
        .status(200)
        .json({ msg: 'Comentario modificado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo modificar el comentario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const eliminarComentarioDelPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comentarioEliminado = await Comentarios.destroy({
      where: {
        post_id: postId,
      },
    });
    if (comentarioEliminado) {
      return res.status(200).json({ msg: 'Comentario eliminado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el comentario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const eliminarComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const comentarioEliminado = await Comentarios.destroy({
      where: {
        id: comentarioId,
      },
    });
    if (comentarioEliminado) {
      return res.status(200).json({ msg: 'Comentario eliminado exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar el comentario' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const obtenerAmigos = async (req, res) => {
  try {
    //Busca todos los amigos relacionados al usuario actual
    const amigos = await Amistades.findAll({
      where: {
        [Op.or]: {
          usuario_id: req.usuario.id,
          usuario_solicita_id: req.usuario.id,
        },
        [Op.and]: {
          estado: 1,
        },
      },
    });
    const amigosPopulados = await Promise.all(
      amigos.map(async (amigo) => {
        const usuario = await Usuarios.findOne({
          where: {
            id:
              amigo.usuario_id === req.usuario.id
                ? amigo.usuario_solicita_id
                : amigo.usuario_id,
          },
        });
        usuario.clave = null;
        return {
          ...amigo.dataValues,
          usuario_id: usuario.dataValues,
        };
      })
    );
    res.status(200).json({ amigos: amigosPopulados });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const enviarSolicitudAmistad = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    //Validar que no se envie una solicitud de amistad a si mismo
    if (usuarioId === req.usuario.id) {
      return res
        .status(400)
        .json({ msg: 'No se puede enviar una solicitud a si mismo' });
    }
    const solicitud = await Amistades.findOne({
      where: {
        [Op.or]: [
          {
            usuario_id: req.usuario.id,
            usuario_solicita_id: usuarioId,
          },
        ],
      },
    });
    const solicitudUsuarioSolicitante = await Amistades.findOne({
      where: {
        [Op.or]: [
          {
            usuario_id: usuarioId,
            usuario_solicita_id: req.usuario.id,
          },
        ],
      },
    });
    if (solicitud || solicitudUsuarioSolicitante) {
      return res
        .status(400)
        .json({ msg: 'Ya existe una solicitud de amistad' });
    }
    const solicitudAmistad = await Amistades.create({
      usuario_id: req.usuario.id,
      usuario_solicita_id: usuarioId,
    });
    if (solicitudAmistad) {
      return res.status(200).json({ msg: 'Solicitud enviada exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo enviar la solicitud' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerSolicitudesPendientes = async (req, res) => {
  try {
    const solicitudes = await Amistades.findAll({
      where: {
        usuario_solicita_id: req.usuario.id,
        estado: 0,
      },
    });
    //Polular campo usuario_id
    const solicitudesPopuladas = await Promise.all(
      solicitudes.map(async (solicitud) => {
        const usuarioSolicita = await Usuarios.findOne({
          where: {
            id: solicitud.usuario_id,
          },
        });
        usuarioSolicita.clave = null;
        return {
          ...solicitud.dataValues,
          usuario_id: usuarioSolicita.dataValues,
        };
      })
    );
    res.status(200).json({ solicitudes: solicitudesPopuladas });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const obtenerSolicitudesPendientesEnviadas = async (req, res) => {
  try {
    const solicitudes = await Amistades.findAll({
      where: {
        usuario_id: req.usuario.id,
        estado: 0,
      },
    });
    res.status(200).json({ solicitudes: solicitudes });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
const actualizarEstadoSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const solicitudActualizada = await Amistades.update(
      {
        estado,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (solicitudActualizada) {
      return res
        .status(200)
        .json({ msg: 'Solicitud actualizada exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo actualizar la solicitud' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};

const eliminarSolicitud = async (req, res) => {
  const { id } = req.params;
  try {
    const amistadEliminada = await Amistades.destroy({
      where: {
        id,
      },
    });
    if (amistadEliminada) {
      return res.status(200).json({ msg: 'Solicitud eliminada exitosamente' });
    }
    res.status(400).json({ msg: 'No se pudo eliminar la solicitud' });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
};
module.exports = {
  registrarUsuarios,
  loginUsuario,
  obtenerUsuarios,
  modificarPerfil,
  modificarClave,
  eliminarPerfil,
  obtenerPostUsuario,
  obtenerPosts,
  crearPost,
  obtenerPost,
  modificarPost,
  eliminarPost,
  obtenerComentarios,
  crearComentario,
  modificarComentario,
  eliminarComentarioDelPost,
  eliminarComentario,
  obtenerAmigos,
  enviarSolicitudAmistad,
  obtenerSolicitudesPendientes,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
  obtenerPerfil,
  obtenerSolicitudesPendientesEnviadas,
};
