-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 21-02-2022 a las 17:37:22
-- Versión de PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `actividad_3`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amistades`
--

CREATE TABLE `amistades` (
  `id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `usuario_solicita_id` int NOT NULL,
  `estado` int NOT NULL DEFAULT '0',
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `amistades`
--

INSERT INTO `amistades` (`id`, `usuario_id`, `usuario_solicita_id`, `estado`, `fecha`) VALUES
(18, 3, 1, 1, '2022-02-21 04:56:11'),
(22, 2, 6, 0, '2022-02-21 06:08:19'),
(23, 2, 1, 1, '2022-02-21 15:27:46');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int NOT NULL,
  `comentario` text COLLATE utf8_bin NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` int NOT NULL,
  `post_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `comentarios`
--

INSERT INTO `comentarios` (`id`, `comentario`, `fecha`, `usuario_id`, `post_id`) VALUES
(1, 'hola mundo desde mi casa', '2022-02-20 06:35:17', 2, 4),
(3, 'hola luis', '2022-02-20 06:41:43', 2, 4),
(5, 'Montañas', '2022-02-20 06:54:55', 3, 4),
(7, 'Gracias por tu comentario', '2022-02-20 06:55:39', 3, 4),
(8, 'Me gusta mucho tu fondo', '2022-02-20 06:55:52', 3, 1),
(10, 'Gracias por compartir', '2022-02-20 06:55:57', 3, 1),
(11, 'De que pagina lo sacaste?', '2022-02-20 06:55:58', 3, 1),
(12, 'Imagen obtenido de intener', '2022-02-20 06:56:19', 2, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `posts`
--

CREATE TABLE `posts` (
  `id` int NOT NULL,
  `contenido` varchar(255) COLLATE utf8_bin NOT NULL,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `foto` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `usuario_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `posts`
--

INSERT INTO `posts` (`id`, `contenido`, `fecha`, `foto`, `usuario_id`) VALUES
(1, 'Post actualizado', '2022-02-20 02:48:33', 'foto-1645325313485.jpg', 2),
(4, 'Ejemplo de mi primera publicacion', '2022-02-20 06:16:59', 'foto-1645337819036.jpg', 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `nombre` varchar(100) COLLATE utf8_bin NOT NULL,
  `sexo` varchar(100) COLLATE utf8_bin NOT NULL,
  `usuario` varchar(40) COLLATE utf8_bin NOT NULL,
  `clave` varchar(100) COLLATE utf8_bin NOT NULL,
  `fecha_nacimiento` varchar(200) COLLATE utf8_bin NOT NULL,
  `foto` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `creado_el` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8_bin;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `sexo`, `usuario`, `clave`, `fecha_nacimiento`, `foto`, `creado_el`) VALUES
(1, 'Jose', 'M', 'jose@email.com', '$2a$12$DoXSVd8N7XE/EpBqMpOl5eG1mXQhQvNnKl.Bh8662ICXZDPd.cdCe', '10-10-2000', 'profile.png', '2022-02-19 04:07:12'),
(2, 'Manuel Nava', 'Masculino', 'manuel@gmail.com', '$2b$10$QLT9/iWsjsupxvl.MHW34O5S5nKvhBgn/IriV8NYvVvKaQVwT6OyW', '2012-04-14', 'foto-1645379454734.png', '2022-02-19 19:25:30'),
(3, 'maria', 'Femenino', 'maria@gmail.com', '$2b$10$7aL7nibepv3PRnNGq48u0eoMSz250HDiyJ0sWqBASDJg0LJdzDrZm', '2015-January-1', 'profile.png', '2022-02-20 06:16:22'),
(6, 'Luis', 'Masculino', 'luis@gmail.com', '$2b$10$Q78Lf8GlRdBw6r/kFGXwEed.8r7sDb1XuAyTWv5LLbfm2H1DeQLCa', '2001-10-01', 'foto-1645478618310.png', '2022-02-20 19:20:30');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amistades`
--
ALTER TABLE `amistades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`,`usuario_solicita_id`),
  ADD KEY `usuario_solicita_id` (`usuario_solicita_id`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`,`post_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Indices de la tabla `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `amistades`
--
ALTER TABLE `amistades`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amistades`
--
ALTER TABLE `amistades`
  ADD CONSTRAINT `amistades_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `amistades_ibfk_2` FOREIGN KEY (`usuario_solicita_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
