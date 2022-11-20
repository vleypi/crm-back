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
-- Структура таблицы `tokens`
--

CREATE TABLE `tokens` (
  `token_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `refreshToken` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `tokens`
--

INSERT INTO `tokens` (`token_id`, `user_id`, `refreshToken`) VALUES
('1', 'Ej2p0Xwqj', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IkVqMnAwWHdxaiIsImlhdCI6MTY2ODUyMjI5MiwiZXhwIjoxNjcxMTE0MjkyfQ.LdO1xyjA-ZgYCqBuYje9e8QxsoXJaMuTTSyQnzoiWf8'),
('vZ9VhLFL9', 'undefined', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2Njg3MDE1NjUsImV4cCI6MTY3MTI5MzU2NX0.FRC_7HgnrK7K5B_FZFLwvHC_fpOy2gG-58nUT7aaKSg'),
('SWK6csWDm', '_vGxtYTGs', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Il92R3h0WVRHcyIsImlhdCI6MTY2ODc5NTI3NCwiZXhwIjoxNjcxMzg3Mjc0fQ.Q_h-PZ6NePZOMfWJlUR3ovBdDv-Tzw3WDmHAPYSG0xQ'),
('c_qvjfP81', 'dHWaPfqWS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRIV2FQZnFXUyIsInJvbGUiOiLQktC70LDQtNC10LvQtdGGIiwiaWF0IjoxNjY4OTcyMzY5LCJleHAiOjE2NzE1NjQzNjl9.rermGfH8RrSp6rYux_i5yiaucahQBai0fwZncH-q8fs');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `tokens`
--
ALTER TABLE `tokens`
  ADD KEY `token_id` (`token_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
