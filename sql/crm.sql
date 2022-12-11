-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1
-- Время создания: Дек 11 2022 г., 11:48
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

INSERT INTO `appointments` (`id`, `rRule`, `startDate`, `endDate`, `lesson_id`, `notes`, `allDay`) VALUES
('HiajsPCe_', 'RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20221231T104414Z;BYDAY=SU', '2022-12-11T07:30:00.000Z', '2022-12-11T08:00:00.000Z', '6u1sMKnM6', '', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `blog`
--

CREATE TABLE `blog` (
  `blog_id` varchar(255) NOT NULL,
  `blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`blocks`)),
  `header` varchar(120) NOT NULL,
  `date` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `blog`
--

INSERT INTO `blog` (`blog_id`, `blocks`, `header`, `date`) VALUES
('r-F9-PXgK', '[{\"type\":\"image\",\"data\":{\"file\":{\"url\":\"http://localhost:5001/static/blog/20412627725236156.png\"},\"caption\":\"\",\"withBorder\":false,\"stretched\":true,\"withBackground\":false}},{\"type\":\"paragraph\",\"data\":{\"text\":\"Текст\"}},{\"type\":\"paragraph\",\"data\":{\"text\":\"<b>Текст</b>\"}},{\"type\":\"paragraph\",\"data\":{\"text\":\"<i>Текст</i>\"}},{\"type\":\"table\",\"data\":{\"withHeadings\":false,\"content\":[[\"Таблица 1\",\"Таблица 2\"],[\"1\",\"2\"]]}},{\"type\":\"list\",\"data\":{\"style\":\"ordered\",\"items\":[\"список\",\"список 2\",\"список 3\"]}},{\"type\":\"header\",\"data\":{\"text\":\"h1\",\"level\":1}},{\"type\":\"header\",\"data\":{\"text\":\"h2\",\"level\":2}},{\"type\":\"header\",\"data\":{\"text\":\"h3\",\"level\":3}}]', 'Это первый пост', '1670755333645');

-- --------------------------------------------------------

--
-- Структура таблицы `chat`
--

CREATE TABLE `chat` (
  `chat_id` varchar(255) NOT NULL,
  `chat_name` varchar(255) NOT NULL,
  `chat_author` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chat`
--

INSERT INTO `chat` (`chat_id`, `chat_name`, `chat_author`) VALUES
('fX-TLI5E2', 'Английский Язык', 'dHWaPfqWS');

-- --------------------------------------------------------

--
-- Структура таблицы `chat_messages`
--

CREATE TABLE `chat_messages` (
  `message_id` varchar(255) NOT NULL,
  `message_date` varchar(255) NOT NULL,
  `message_text` varchar(255) NOT NULL,
  `message_image` varchar(255) NOT NULL,
  `group_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `chat_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `chat_message_status`
--

CREATE TABLE `chat_message_status` (
  `message_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `chat_roster`
--

CREATE TABLE `chat_roster` (
  `chat_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `group_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `chat_roster`
--

INSERT INTO `chat_roster` (`chat_id`, `user_id`, `group_id`) VALUES
('fX-TLI5E2', 'dHWaPfqWS', 'fX-TLI5E2'),
('fX-TLI5E2', 'B_c7v5ETI', 'fX-TLI5E2'),
('fX-TLI5E2', 'wpVocjtNK', 'fX-TLI5E2'),
('fX-TLI5E2', 'sc9GdboCO', 'fX-TLI5E2');

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
('6u1sMKnM6', 'Английский(Евгений Дёмин)', '#2196f3', 1, 1, 'https://us04web.zoom.us/');

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
('wpVocjtNK', '6u1sMKnM6', 'Ученик'),
('sc9GdboCO', '6u1sMKnM6', 'Ученик'),
('B_c7v5ETI', '6u1sMKnM6', 'Педагог');

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
('bA2T7_9nR', 'Посетил', '#8bc34a', '', 1, 1, 1),
('Kx8o8qP_l', 'Пропустил', '#f44336', '', 1, 1, 0),
('tUHHTklTG', 'Болел', '#ff9800', '', 0, 0, 0),
('VaDkBUEDG', 'К отработке', '#2196f3', '', 1, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `tokens`
--

CREATE TABLE `tokens` (
  `token_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `refreshToken` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `user_id` varchar(255) NOT NULL,
  `balance` int(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `avatar` longtext NOT NULL,
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

INSERT INTO `users` (`user_id`, `balance`, `name`, `avatar`, `surname`, `gender`, `phone`, `email`, `password`, `role`) VALUES
('dHWaPfqWS', 0, 'Админ', '', '', 'Мужской', '89991099479', 'admin@admin.com', '$2a$07$APRnSzNYegrfDVP0sdna7esOoS6Ng73gMHU/MbIq.CCI/1dT3vfxK', 'Владелец'),
('wpVocjtNK', 0, 'Владимир Парфенов', '', '', 'Мужской', '89991099479', 'student@gmail.com', '$2a$07$SaD3iSiGbFeqLb7paA/QJ.f.jky3lwKwsWp.for/0j7wlOuTBgo46', 'Ученик'),
('sc9GdboCO', 0, 'Макаров Никита', '', '', 'Мужской', '89967071344', 'makarov@gmail.com', '12312312', 'Ученик'),
('Zp9YhGxJS', 0, 'Илья Саблин', '', '', 'Мужской', '89973097832', 'sablin@gmail.com', '$2a$07$Q9cZOUrXAIPv4mx/8m5TU.NieOJRm3xkG0J6kYPVEgv2isEXCNEQm', 'Ученик'),
('B_c7v5ETI', 0, 'Евгений Дёмин', '', '', 'Мужской', '89991039479', 'teacher@gmail.com', '$2a$07$vNM4wbXdQHKrI6jeRkNrKOoZnD4MOLZTPK09UxK.nQYKhsTZmj3p2', 'Педагог');

-- --------------------------------------------------------

--
-- Структура таблицы `visits_users`
--

CREATE TABLE `visits_users` (
  `appointment_id` varchar(255) NOT NULL,
  `lesson_id` varchar(255) NOT NULL,
  `user_id` varchar(255) NOT NULL,
  `status_id` varchar(255) NOT NULL,
  `day` varchar(255) NOT NULL,
  `month` varchar(255) NOT NULL,
  `year` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `visits_users`
--

INSERT INTO `visits_users` (`appointment_id`, `lesson_id`, `user_id`, `status_id`, `day`, `month`, `year`) VALUES
('HiajsPCe_', '6u1sMKnM6', 'sc9GdboCO', 'Kx8o8qP_l', '18', '11', '2022'),
('HiajsPCe_', '6u1sMKnM6', 'sc9GdboCO', 'tUHHTklTG', '11', '11', '2022'),
('HiajsPCe_', '6u1sMKnM6', 'wpVocjtNK', 'Kx8o8qP_l', '11', '11', '2022');

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
