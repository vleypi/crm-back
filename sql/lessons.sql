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
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` varchar(255) NOT NULL,
  `lesson_name` varchar(255) NOT NULL,
  `lesson_color` varchar(255) NOT NULL,
  `lesson_status` int(255) NOT NULL,
  `lesson_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `lesson_name`, `lesson_color`, `lesson_status`, `lesson_type`) VALUES
('f5RK7-FSt', 'qweqw', '#e91e63', 1, 1),
('1mjMU_Kk5', 'fdsf', '#f44336', 1, 1),
('5kg09-jnk', 'qweq', '#f44336', 1, 1),
('-3r7XtV9f', 'qweqw', '#e91e63', 1, 1),
('irl4sxEaL', 'Анлийский', '#f44336', 1, 1),
('vehuEk-ak', '12312', '#f44336', 1, 2),
('nvbocuo_T', 'Английский', '#00bcd4', 1, 2);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
