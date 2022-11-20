-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Ноя 20 2022 г., 20:32
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
-- Структура таблицы `statuses_visits`
--

CREATE TABLE `statuses_visits` (
  `status_id` varchar(255) NOT NULL,
  `status_name` varchar(255) NOT NULL,
  `status_color` varchar(255) NOT NULL,
  `status_desc` varchar(255) NOT NULL,
  `status_withdraw` tinyint(1) NOT NULL,
  `status_pay` tinyint(1) NOT NULL,
  `status_visited` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `statuses_visits`
--

INSERT INTO `statuses_visits` (`status_id`, `status_name`, `status_color`, `status_desc`, `status_withdraw`, `status_pay`, `status_visited`) VALUES
('1GaAiqs7X', 'К отработке', '#2196f3', '', 1, 0, 0),
('bA2T7_9nR', 'Посетил', '#8bc34a', '', 1, 1, 1),
('Kx8o8qP_l', 'Пропустил', '#f44336', '', 1, 1, 0),
('tUHHTklTG', 'Болел', '#ff9800', '', 0, 0, 0);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `statuses_visits`
--
ALTER TABLE `statuses_visits`
  ADD PRIMARY KEY (`status_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
