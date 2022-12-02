-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 02 2022 г., 10:14
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
-- Структура таблицы `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `rRule` varchar(255) NOT NULL,
  `startDate` varchar(255) NOT NULL,
  `endDate` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `allDay` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `appointments`
--

INSERT INTO `appointments` (`id`, `title`, `rRule`, `startDate`, `endDate`, `lesson_id`, `notes`, `allDay`) VALUES
('jtrkTeTXY', 'Английский', 'RRULE:INTERVAL=1;FREQ=WEEKLY;BYDAY=MO,WE,FR', '2022-11-30T05:30:00.000Z', '2022-11-30T06:30:00.000Z', 'UrbVZcaxP', '', 0),
('P1cEvkVrH', 'Китайский', 'RRULE:INTERVAL=1;FREQ=WEEKLY;BYDAY=TU,MO,TH', '2022-12-05T04:30:00.000Z', '2022-12-05T06:00:00.000Z', 'faIPNj7fm', '', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `blog`
--

CREATE TABLE `blog` (
  `blog_id` varchar(255) NOT NULL,
  `blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`blocks`)),
  `header` varchar(120) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `blog`
--

INSERT INTO `blog` (`blog_id`, `blocks`, `header`, `date`) VALUES
('8LPl2Pw-7', '{\"time\":1669143841767,\"blocks\":[{\"id\":\"Kpb2ijRD4q\",\"type\":\"paragraph\",\"data\":{\"text\":\"312312\"}}],\"version\":\"2.25.0\"}', '12312', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Структура таблицы `lessons`
--

CREATE TABLE `lessons` (
  `lesson_id` varchar(255) NOT NULL,
  `lesson_name` varchar(255) NOT NULL,
  `lesson_color` varchar(255) NOT NULL,
  `lesson_status` int(255) NOT NULL,
  `lesson_type` int(11) NOT NULL,
  `lesson_link` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `lessons`
--

INSERT INTO `lessons` (`lesson_id`, `lesson_name`, `lesson_color`, `lesson_status`, `lesson_type`, `lesson_link`) VALUES
('UrbVZcaxP', 'Английский', '#2196f3', 1, 1, 'https://www.youtube.com/'),
('faIPNj7fm', 'Китайский', '#f44336', 1, 2, 'https://www.youtube.com/'),
('EOX5tm2Il', 'Иврит', '#00bcd4', 1, 1, 'https://www.youtube.com/');

-- --------------------------------------------------------

--
-- Структура таблицы `lessons_type`
--

CREATE TABLE `lessons_type` (
  `id` int(255) NOT NULL,
  `lesson_type_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `lessons_type`
--

INSERT INTO `lessons_type` (`id`, `lesson_type_name`) VALUES
(1, 'Группа'),
(2, 'Индивидуальное');

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
('wpVocjtNK', 'UrbVZcaxP', 'Ученик'),
('sc9GdboCO', 'UrbVZcaxP', 'Ученик'),
('B_c7v5ETI', 'UrbVZcaxP', 'Педагог'),
('sc9GdboCO', 'faIPNj7fm', 'Ученик'),
('wpVocjtNK', 'EOX5tm2Il', 'Ученик'),
('B_c7v5ETI', 'EOX5tm2Il', 'Педагог');

-- --------------------------------------------------------

--
-- Структура таблицы `roles`
--

CREATE TABLE `roles` (
  `id` int(255) NOT NULL,
  `role_name` varchar(255) NOT NULL,
  `role_description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `roles`
--

INSERT INTO `roles` (`id`, `role_name`, `role_description`) VALUES
(1, 'Владелец', 'Полный доступ'),
(2, 'Педагог', ''),
(3, 'Ученик', '');

-- --------------------------------------------------------

--
-- Структура таблицы `statuses`
--

CREATE TABLE `statuses` (
  `id` int(255) NOT NULL,
  `status_name` varchar(255) NOT NULL,
  `status_color` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `statuses`
--

INSERT INTO `statuses` (`id`, `status_name`, `status_color`) VALUES
(1, 'Активный', 'Green'),
(2, 'В архиве', 'Red');

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
('c_qvjfP81', 'dHWaPfqWS', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRIV2FQZnFXUyIsInJvbGUiOiLQktC70LDQtNC10LvQtdGGIiwiaWF0IjoxNjY5OTIwOTgwLCJleHAiOjE2NzI1MTI5ODB9.RjsBz6J0XwRouEUc_CH7zBR6oZIDBXLJwV31ui7UUqY'),
('TbeVQ26ZP', '637d085e3deac37fefd9c5f4', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzN2QwODVlM2RlYWMzN2ZlZmQ5YzVmNCIsImlhdCI6MTY2OTEzOTY4NCwiZXhwIjoxNjcxNzMxNjg0fQ.1x0hHuMU9EXN4ptZxs-C6urbocFuuEmry154tymjSfA');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `balance` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `phone` decimal(11,0) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`user_id`, `balance`, `name`, `surname`, `gender`, `phone`, `email`, `password`, `role`) VALUES
('dHWaPfqWS', 0, 'vova', 'parfenov', '', '89991099479', 'vl@gmail.com', '$2a$07$pZgnaFb6rAqfMbEj7PskLuSsgowJY3jd2Fp255OIKk21BnDjhBb56', 'Владелец'),
('wpVocjtNK', 0, 'Владимир Парфенов', '', 'Мужской', '89991099479', 'vleypi@gmail.com', '12345678', 'Ученик'),
('sc9GdboCO', 0, 'Макаров Никита', '', 'Мужской', '89967071344', 'makarov@gmail.com', '12312312', 'Ученик'),
('Zp9YhGxJS', 0, 'Илья Саблин', '', 'Мужской', '89973097832', 'sablin@gmail.com', '$2a$07$Q9cZOUrXAIPv4mx/8m5TU.NieOJRm3xkG0J6kYPVEgv2isEXCNEQm', 'Ученик'),
('B_c7v5ETI', 0, 'Евгений Дёмин', '', 'Мужской', '89991039479', 'evgeniy@gmail.com', '$2a$07$D1cX3Rso7c3M9BFMm6uGTe.gCxYagkomoYMymkuO0HxoHb.aguqVm', 'Педагог');

-- --------------------------------------------------------

--
-- Структура таблицы `visits`
--

CREATE TABLE `visits` (
  `visit_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `day` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `visits`
--

INSERT INTO `visits` (`visit_id`, `lesson_id`, `day`, `month`, `year`) VALUES
('PNt8Q1o7M', 'UrbVZcaxP', '30', '10', '2022'),
('elmGDFQkh', 'UrbVZcaxP', '30', '10', '2022'),
('w_5HM5TRI', 'UrbVZcaxP', '30', '10', '2022'),
('GbdHaqiUno', 'UrbVZcaxP', '30', '10', '2022'),
('dMi9p2XM4', 'UrbVZcaxP', '30', '10', '2022'),
('DTK5v-5Ym', 'UrbVZcaxP', '30', '10', '2022'),
('BhX5PD8zT', 'UrbVZcaxP', '30', '10', '2022'),
('9mM0AXPSo', 'UrbVZcaxP', '30', '10', '2022'),
('8Gn42Re_J', 'UrbVZcaxP', '30', '10', '2022'),
('CN-FRvrTy', 'UrbVZcaxP', '30', '10', '2022'),
('P-EDdyN05', 'UrbVZcaxP', '30', '10', '2022'),
('z1z-V1j5b', 'UrbVZcaxP', '30', '10', '2022'),
('Rz6FomKa5', 'UrbVZcaxP', '30', '10', '2022'),
('UAQLwyy5k', 'UrbVZcaxP', '30', '10', '2022'),
('RFkU_Kq0_', 'UrbVZcaxP', '30', '10', '2022'),
('Rs24B9tMT', 'UrbVZcaxP', '30', '10', '2022'),
('7ysKNTRIA', 'UrbVZcaxP', '30', '10', '2022'),
('2UHP_lZaJ', 'UrbVZcaxP', '30', '10', '2022'),
('iqiCLJEff', 'UrbVZcaxP', '30', '10', '2022'),
('0legi9p4l', 'UrbVZcaxP', '30', '10', '2022'),
('PwmWHAIMq', 'UrbVZcaxP', '30', '10', '2022'),
('WlyK2j9q6', 'UrbVZcaxP', '30', '10', '2022'),
('dXfCOfDqW', 'UrbVZcaxP', '30', '10', '2022'),
('sYRdOlwzQ', 'UrbVZcaxP', '30', '10', '2022'),
('rCfja0Z1Z', 'UrbVZcaxP', '30', '10', '2022'),
('BMKKxDJg-', 'UrbVZcaxP', '30', '10', '2022'),
('RTKaNuWf9', 'UrbVZcaxP', '30', '10', '2022'),
('RUGiHG2zA', 'UrbVZcaxP', '30', '10', '2022'),
('b6122ioX3', 'UrbVZcaxP', '30', '10', '2022'),
('z4VQwqPcI', 'UrbVZcaxP', '30', '10', '2022'),
('rJjOhl2QU', 'UrbVZcaxP', '30', '10', '2022'),
('jLG_TDKez', 'UrbVZcaxP', '30', '10', '2022'),
('EH9NYVs-4', 'UrbVZcaxP', '30', '10', '2022'),
('Sm5WFs2r9', 'UrbVZcaxP', '30', '10', '2022'),
('25NQ8G39N', 'UrbVZcaxP', '30', '10', '2022'),
('vongQd1Zv', 'UrbVZcaxP', '30', '10', '2022'),
('2-c9aQ7lP', 'faIPNj7fm', '8', '11', '2022'),
('wD41LFmIf', 'faIPNj7fm', '8', '11', '2022'),
('1iQmq7bHY', 'faIPNj7fm', '6', '11', '2022'),
('iITydbLvC', 'faIPNj7fm', '6', '11', '2022'),
('vYbMK0VZc', 'faIPNj7fm', '5', '11', '2022'),
('LwebOb61d', 'faIPNj7fm', '5', '11', '2022'),
('XWavQcR4Z', 'faIPNj7fm', '8', '11', '2022'),
('vEY2Uob4z', 'faIPNj7fm', '8', '11', '2022'),
('jduS7P17u', 'faIPNj7fm', '8', '11', '2022'),
('tNnJ5dre4', 'faIPNj7fm', '8', '11', '2022'),
('0_FMqBTV0', 'faIPNj7fm', '8', '11', '2022'),
('pi1vvgAN9', 'faIPNj7fm', '8', '11', '2022');

-- --------------------------------------------------------

--
-- Структура таблицы `visits_users`
--

CREATE TABLE `visits_users` (
  `visit_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `status_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `visits_users`
--

INSERT INTO `visits_users` (`visit_id`, `user_id`, `lesson_id`, `status_id`) VALUES
('PNt8Q1o7M', 'sc9GdboCO', 'UrbVZcaxP', 'tUHHTklTG'),
('PNt8Q1o7M', 'wpVocjtNK', 'UrbVZcaxP', '1GaAiqs7X'),
('2-c9aQ7lP', 'sc9GdboCO', 'faIPNj7fm', 'tUHHTklTG'),
('1iQmq7bHY', 'sc9GdboCO', 'faIPNj7fm', 'tUHHTklTG'),
('vYbMK0VZc', 'sc9GdboCO', 'faIPNj7fm', 'tUHHTklTG');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `lessons_type`
--
ALTER TABLE `lessons_type`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `statuses_visits`
--
ALTER TABLE `statuses_visits`
  ADD PRIMARY KEY (`status_id`);

--
-- Индексы таблицы `tokens`
--
ALTER TABLE `tokens`
  ADD KEY `token_id` (`token_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `lessons_type`
--
ALTER TABLE `lessons_type`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT для таблицы `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
