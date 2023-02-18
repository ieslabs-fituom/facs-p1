-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Feb 18, 2023 at 08:56 AM
-- Server version: 8.0.27
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `faculty_access_schema`
--

-- --------------------------------------------------------

--
-- Table structure for table `batches`
--

DROP TABLE IF EXISTS `batches`;
CREATE TABLE IF NOT EXISTS `batches` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Batch` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `Batch`, `create_time`, `update_time`) VALUES
(1, 20, '2023-02-18 06:47:28', NULL),
(2, 21, '2023-02-18 06:47:33', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `degrees`
--

DROP TABLE IF EXISTS `degrees`;
CREATE TABLE IF NOT EXISTS `degrees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Degree` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `degree_faculty_foreign_idx` (`Faculty`),
  KEY `degree_department_foreign_idx` (`Department`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `degrees`
--

INSERT INTO `degrees` (`id`, `Degree`, `Faculty`, `Department`, `create_time`, `update_time`) VALUES
(1, 'BSc. (IT)', 1, 1, '2023-02-18 07:06:17', NULL),
(2, 'BSc. (AI)', 1, 2, '2023-02-18 07:06:41', NULL),
(3, 'BSc. (CSE)', 2, 3, '2023-02-18 07:07:09', NULL),
(4, 'BSc. (EE)', 2, 4, '2023-02-18 07:07:25', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
CREATE TABLE IF NOT EXISTS `departments` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department_faculty_foreign_idx` (`Faculty`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `Name`, `Faculty`) VALUES
(1, 'Department of Information Technology', 1),
(2, 'Department of Computational Mathematics', 1),
(3, 'Department of Computer Science And Engineering', 2),
(4, 'Department of Electrical Engineering', 2),
(5, 'Department of Interdisciplinary Studies', 1);

-- --------------------------------------------------------

--
-- Table structure for table `designations`
--

DROP TABLE IF EXISTS `designations`;
CREATE TABLE IF NOT EXISTS `designations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=272 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `designations`
--

INSERT INTO `designations` (`id`, `Name`) VALUES
(1, 'Lecturer'),
(2, 'Professor'),
(3, 'Head of Department'),
(4, 'Dean');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
CREATE TABLE IF NOT EXISTS `employees` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Index` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uid` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `Designation` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email_verified_at` timestamp NULL DEFAULT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Api_token` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employees_department_foreign` (`Department`),
  KEY `employees_designation_foreign` (`Designation`),
  KEY `employees_faculty_foreign_idx` (`Faculty`)
) ENGINE=InnoDB AUTO_INCREMENT=1177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `Index`, `Uid`, `Name`, `Telephone`, `Address`, `Faculty`, `Department`, `Designation`, `created_at`, `updated_at`, `Email`, `Email_verified_at`, `Password`, `Api_token`, `Remember_token`) VALUES
(1, 'lec1001', '1001', 'PERERA A.B.', '1234567890', 'Colombo, Sri Lanka', 1, 1, 1, NULL, NULL, 'pereraab@uom.lk', NULL, 'pab', NULL, NULL),
(2, 'lec1002', '1002', 'SILVA B.C.', '7894561230', 'Kandy, Sri Lanka.', 1, 2, 3, NULL, NULL, 'silvabc', NULL, 'sbc', NULL, NULL),
(3, 'lec1003', '1003', 'GAMAGE X.Y.', '1472583690', 'Galle, Sri Lanka.', 1, 1, 4, NULL, NULL, 'gamagexy@uom.lk', NULL, 'gxy', NULL, NULL),
(4, 'lec1004', '1003', 'NIMAL P.Q.', '9638527410', 'Hambanthota, Sri Lanka.', 2, 3, 1, NULL, NULL, 'nimalpq@uom.lk', NULL, 'npq', NULL, NULL),
(5, 'lec1005', '1005', 'KAMAL D.E.', '7539514560', 'Moratuwa, Sri Lanka.', 1, 2, 2, NULL, NULL, '', NULL, 'kde', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees_of_groups`
--

DROP TABLE IF EXISTS `employees_of_groups`;
CREATE TABLE IF NOT EXISTS `employees_of_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Employee` int UNSIGNED NOT NULL,
  `Group` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employeegroup_employee_foreign_idx` (`Employee`),
  KEY `employeegroup_group_foreign_idx` (`Group`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `faculties`
--

DROP TABLE IF EXISTS `faculties`;
CREATE TABLE IF NOT EXISTS `faculties` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `faculties`
--

INSERT INTO `faculties` (`id`, `Name`) VALUES
(1, 'Faculty of Information Technology'),
(2, 'Faculty of Engineering');

-- --------------------------------------------------------

--
-- Table structure for table `groups_for_students`
--

DROP TABLE IF EXISTS `groups_for_students`;
CREATE TABLE IF NOT EXISTS `groups_for_students` (
  `id` int NOT NULL,
  `Student` int NOT NULL,
  `Group` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `groupStudent_group_foreign_idx` (`Group`),
  KEY `groupStudent_student_foreign_idx` (`Student`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `medical_forms`
--

DROP TABLE IF EXISTS `medical_forms`;
CREATE TABLE IF NOT EXISTS `medical_forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `Session` int NOT NULL,
  `Medical_form` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medical_student_foreign_idx` (`Student`),
  KEY `medical_session_foreign_idx` (`Session`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

DROP TABLE IF EXISTS `modules`;
CREATE TABLE IF NOT EXISTS `modules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `Name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `module_faculty_foreign_idx` (`Faculty`),
  KEY `module_department_foreign_idx` (`Department`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `Code`, `Name`, `Faculty`, `Department`, `create_time`, `update_time`) VALUES
(1, 'IN1000', 'Programming Fundamentals', 1, 1, '2023-02-18 07:53:47', NULL),
(2, 'IN1001', 'Digital Systems Design', 1, 1, '2023-02-18 07:53:57', NULL),
(3, 'CM1000', 'Fundamentals of Mathematics', 1, 2, '2023-02-18 07:54:15', NULL),
(4, 'CM1001', 'Elements of Statistics', 1, 2, '2023-02-18 07:54:30', NULL),
(5, 'IS1000', 'English', 1, 5, '2023-02-18 07:57:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int NOT NULL,
  `Group` int NOT NULL,
  `Start_time` timestamp NOT NULL,
  `Duration` double NOT NULL,
  `Method` tinyint NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `Type` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `session_group_foreign_idx` (`Group`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL,
  `Index` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Degree` int NOT NULL,
  `Batch` int NOT NULL,
  `Academic_Advisor` int UNSIGNED NOT NULL,
  `Email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email_verified_at` timestamp NULL DEFAULT NULL,
  `Password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Api_token` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `students_faculty_foreign` (`Faculty`),
  KEY `student_degree_foreign_idx` (`Degree`),
  KEY `student_batch_foreign_idx` (`Batch`),
  KEY `student_advisor_foreign_idx` (`Academic_Advisor`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `students`
--

INSERT INTO `students` (`id`, `Index`, `Uid`, `Name`, `Telephone`, `Address`, `Faculty`, `Degree`, `Batch`, `Academic_Advisor`, `Email`, `Email_verified_at`, `Password`, `Api_token`, `Remember_token`, `created_at`, `updated_at`) VALUES
(1, '214001', '001214', 'KASUN A.B.', '1472583690', 'Matara, Sri Lanka', 1, 1, 2, 1, 'kasunab@uom.lk', NULL, 'kab', NULL, NULL, NULL, NULL),
(2, '214002', '002214', 'KALUM B.C.', '1234567890', 'Badulla, Sri Lanka.', 1, 1, 2, 5, 'kalumbc@uom.lk', NULL, 'kbc', NULL, NULL, NULL, NULL),
(3, '214003', '003214', 'ASHAN X.Y.', '7539518520', 'Panadura, Sri Lanka.', 2, 3, 1, 4, 'ashanxy@uom.lk', NULL, 'axy', NULL, NULL, NULL, NULL),
(4, '214004', '004214', 'DASUN P.Q.', '7891234560', 'Kalutara, Sri Lanka.', 1, 1, 2, 1, 'dasunpq@uom.lk', NULL, 'dpq', NULL, NULL, NULL, NULL),
(5, '204005', '005204', 'LAKMAL Z.Z.', '7538529510', 'Gampaha, Sri Lanka.', 1, 1, 1, 1, 'lakmalzz@uom.lk', NULL, 'lzz', NULL, NULL, NULL, NULL),
(6, '214006', '006214', 'KASUNI A.A.', '4561597530', 'Matara, Sri Lanka.', 1, 2, 2, 1, 'kasuniaa@uom.lk', NULL, 'kaa', NULL, NULL, NULL, NULL),
(7, '214007', '007214', 'SANDUNI B.B.', '0001112223', 'Galle, Sri Lanka.', 1, 2, 2, 1, 'sandunibb@uom.lk', NULL, 'sbb', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_groups`
--

DROP TABLE IF EXISTS `student_groups`;
CREATE TABLE IF NOT EXISTS `student_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) COLLATE utf8_unicode_ci NOT NULL,
  `Module` int NOT NULL,
  `Batch` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_module_foreign_idx` (`Module`),
  KEY `group_batch_foreign_idx` (`Batch`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `student_groups`
--

INSERT INTO `student_groups` (`id`, `Name`, `Module`, `Batch`, `create_time`, `update_time`) VALUES
(1, 'mod5_a1', 5, 2, '2023-02-18 07:58:25', NULL),
(2, 'mod5_a2', 5, 2, '2023-02-18 07:58:38', NULL),
(3, 'mod5_b1', 5, 2, '2023-02-18 07:58:55', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
CREATE TABLE IF NOT EXISTS `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group` int NOT NULL,
  `Day` int UNSIGNED NOT NULL,
  `Start_time` timestamp NOT NULL,
  `End_time` timestamp NULL DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timetable_groups_foreign_idx` (`group`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `degrees`
--
ALTER TABLE `degrees`
  ADD CONSTRAINT `degree_department_foreign` FOREIGN KEY (`Department`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `degree_faculty_foreign` FOREIGN KEY (`Faculty`) REFERENCES `faculties` (`id`);

--
-- Constraints for table `departments`
--
ALTER TABLE `departments`
  ADD CONSTRAINT `department_faculty_foreign` FOREIGN KEY (`Faculty`) REFERENCES `faculties` (`id`);

--
-- Constraints for table `employees`
--
ALTER TABLE `employees`
  ADD CONSTRAINT `employees_department_foreign` FOREIGN KEY (`Department`) REFERENCES `departments` (`id`),
  ADD CONSTRAINT `employees_designation_foreign` FOREIGN KEY (`Designation`) REFERENCES `designations` (`id`),
  ADD CONSTRAINT `employees_faculty_foreign` FOREIGN KEY (`Faculty`) REFERENCES `faculties` (`id`);

--
-- Constraints for table `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `student_advisor_foreign` FOREIGN KEY (`Academic_Advisor`) REFERENCES `employees` (`id`),
  ADD CONSTRAINT `student_batch_foreign` FOREIGN KEY (`Batch`) REFERENCES `batches` (`id`),
  ADD CONSTRAINT `student_degree_foreign` FOREIGN KEY (`Degree`) REFERENCES `degrees` (`id`),
  ADD CONSTRAINT `students_faculty_foreign` FOREIGN KEY (`Faculty`) REFERENCES `faculties` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
