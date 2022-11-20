-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 20 2022 г., 20:31
-- Версия сервера: 10.4.25-MariaDB
-- Версия PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `crm`
--

-- --------------------------------------------------------

--
-- Структура таблицы `lessons_user`
--

CREATE TABLE `lessons_user` (
  `user_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `lessons_user`
--

INSERT INTO `lessons_user` (`user_id`, `lesson_id`, `role`) VALUES
('dasdad', '-3r7XtV9f', 'Ученик'),
('fdfsdf', '-3r7XtV9f', 'Ученик'),
('fdfsdf', 'irl4sxEaL', 'Ученик'),
('dasdad', 'irl4sxEaL', 'Ученик'),
('dasdad', 'vehuEk-ak', 'Ученик'),
('fdfsdf', 'nvbocuo_T', 'Ученик'),
('dasdad', 'nvbocuo_T', 'Ученик');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
