-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Apr 05, 2023 at 10:22 AM
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
-- Table structure for table `attendance_1`
--

DROP TABLE IF EXISTS `attendance_1`;
CREATE TABLE IF NOT EXISTS `attendance_1` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `ses1` varchar(20) NOT NULL DEFAULT '0' COMMENT '0 - absent, Timestamp - present, other(filename) - medical form',
  `ses5` varchar(20) NOT NULL DEFAULT '0' COMMENT '0 - absent, Timestamp - present, other(filename) - medical form',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_1`
--

INSERT INTO `attendance_1` (`id`, `Student`, `ses1`, `ses5`) VALUES
(1, 1, '2023-03-10 09:05:00', '0'),
(2, 3, '2023-03-10 09:10:00', '2023-03-17 09:45:00'),
(3, 4, '0', '02023-03-17 09:35:00');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_3`
--

DROP TABLE IF EXISTS `attendance_3`;
CREATE TABLE IF NOT EXISTS `attendance_3` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `ses2` varchar(20) NOT NULL DEFAULT '0' COMMENT '0 - absent, Timestamp - present, other(filename) - medical form	',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_3`
--

INSERT INTO `attendance_3` (`id`, `Student`, `ses2`) VALUES
(1, 1, '2023-03-05 09:25:00'),
(2, 3, '0'),
(3, 4, '2023-03-05 09:43:00');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_8`
--

DROP TABLE IF EXISTS `attendance_8`;
CREATE TABLE IF NOT EXISTS `attendance_8` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `ses3` varchar(20) NOT NULL DEFAULT '0' COMMENT '0 - absent, Timestamp - present, other(filename) - medical form	',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_8`
--

INSERT INTO `attendance_8` (`id`, `Student`, `ses3`) VALUES
(1, 1, '2023-03-08 13:35:00'),
(2, 3, '2023-03-08 13:45:00');

-- --------------------------------------------------------

--
-- Table structure for table `attendance_17`
--

DROP TABLE IF EXISTS `attendance_17`;
CREATE TABLE IF NOT EXISTS `attendance_17` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `ses4` varchar(20) NOT NULL DEFAULT '0' COMMENT '0 - absent, Timestamp - present, other(filename) - medical form	',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attendance_17`
--

INSERT INTO `attendance_17` (`id`, `Student`, `ses4`) VALUES
(1, 1, '0'),
(2, 3, '2023-03-10 10:55:00'),
(3, 4, '2023-03-10 11:05:00');

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
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `batches`
--

INSERT INTO `batches` (`id`, `Batch`, `create_time`, `update_time`) VALUES
(1, 20, '2023-02-18 06:47:28', NULL),
(2, 21, '2023-02-18 06:47:33', NULL),
(10, 22, '2023-03-02 15:45:12', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `degrees`
--

DROP TABLE IF EXISTS `degrees`;
CREATE TABLE IF NOT EXISTS `degrees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Degree` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `degree_faculty_foreign_idx` (`Faculty`),
  KEY `degree_department_foreign_idx` (`Department`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `degrees`
--

INSERT INTO `degrees` (`id`, `Degree`, `Faculty`, `Department`, `create_time`, `update_time`) VALUES
(1, 'BSc. (IT)', 1, 1, '2023-02-18 07:06:17', NULL),
(2, 'BSc. (AI)', 1, 2, '2023-02-18 07:06:41', NULL),
(3, 'BSc. (CSE)', 2, 3, '2023-02-18 07:07:09', NULL),
(4, 'BSc. (EE)', 2, 4, '2023-02-18 07:07:25', NULL),
(5, 'BSc. (ITM)', 1, 5, '2023-02-21 17:07:44', NULL);

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
  `IndexNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `Designation` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email_verified_at` timestamp NULL DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Api_token` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employees_department_foreign` (`Department`),
  KEY `employees_designation_foreign` (`Designation`),
  KEY `employees_faculty_foreign_idx` (`Faculty`)
) ENGINE=InnoDB AUTO_INCREMENT=1177 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `IndexNo`, `Uid`, `Name`, `Telephone`, `Address`, `Faculty`, `Department`, `Designation`, `created_at`, `updated_at`, `Email`, `Email_verified_at`, `Password`, `Api_token`, `Remember_token`) VALUES
(6, 'lec1000', '1000', 'Supunmalee Ahangama', '1111', 'Colombo, Sri Lanka.', 1, 1, 1, NULL, NULL, 'ahangama@uom.lk', NULL, 'sa', NULL, NULL),
(7, 'lec1001', '1001', 'Priyanga Thalagala', '2222', 'Gampaha, Sri Lanka.', 1, 2, 1, NULL, NULL, 'thalagala@uom.lk', NULL, 'pt', NULL, NULL),
(8, 'lec1002', '1002', 'Mohommad Firdous', '3333', 'Colombo, Sri Lanka.', 1, 1, 2, NULL, NULL, 'firdhouse@uom.lk', NULL, 'mf', NULL, NULL),
(9, 'lec1003', '1003', 'Roshani Wijesooriya', '4444', 'Colombo, Sri Lanka.', 1, 1, 1, NULL, NULL, 'roshani@uom.lk', NULL, 'rw', NULL, NULL),
(10, 'lec1004', '1004', 'Thanuja Sandanayaka', '5555', 'Colombo, Sri Lanka.', 1, 5, 3, NULL, NULL, 'thanuja@uom.lk', NULL, 'ts', NULL, NULL),
(11, 'lec1005', '1005', 'Nipuni Chandimali', '6666', 'Colombo, Sri Lanka.', 1, 1, 1, NULL, NULL, 'nipuni@uom.lk', NULL, 'nc', NULL, NULL),
(12, 'lec1006', '1006', 'M. Mufitha', '7777', 'Colombo, Sri Lanka.', 1, 5, 1, NULL, NULL, 'mufitha@uom.lk', NULL, 'mm', NULL, NULL),
(13, 'lec1007', '1007', 'B.H. Sudantha', '8888', 'Colombo, Sri Lanka.', 1, 1, 4, NULL, NULL, 'sudantha@uom.lk', NULL, 'bhs', NULL, NULL),
(14, 'lec1008', '1008', 'Thilini Piyathilake', '9999', 'Colombo, Sri Lanka.', 1, 2, 2, NULL, NULL, 'thilini@uom.lk', NULL, 'tp', NULL, NULL),
(15, 'lec1009', '1009', 'Saminda Premarathne', '1111', 'Colombo, Sri Lanka.', 1, 1, 3, NULL, NULL, 'saminda@uom.lk', NULL, 'sp', NULL, NULL),
(16, 'lec1010', '1010', 'Sasika Kumarasinghe', '2222', 'Colombo, Sri Lanka.', 1, 1, 1, NULL, NULL, 'sasika@uom.lk', NULL, 'sk', NULL, NULL),
(17, 'lec1011', '1011', 'Sumudu Wijethunga', '2222', 'Colombo, Sri Lanka.', 1, 5, 1, NULL, NULL, 'sumudu@uom.lk', NULL, 'sw', NULL, NULL),
(18, 'lec1012', '1012', 'Dilanthi Fernando', '5555', 'Colombo, Sri Lanka.', 1, 5, 1, NULL, NULL, 'dilanthi@uom.lk', NULL, 'df', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees_of_groups`
--

DROP TABLE IF EXISTS `employees_of_groups`;
CREATE TABLE IF NOT EXISTS `employees_of_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Employee` int UNSIGNED NOT NULL,
  `Emp_group` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employeegroup_employee_foreign_idx` (`Employee`),
  KEY `employeegroup_group_foreign_idx` (`Emp_group`)
) ENGINE=MyISAM AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `employees_of_groups`
--

INSERT INTO `employees_of_groups` (`id`, `Employee`, `Emp_group`, `create_time`, `update_time`) VALUES
(1, 16, 1, '2023-02-21 17:54:56', NULL),
(2, 16, 2, '2023-02-21 17:54:56', NULL),
(3, 13, 3, '2023-02-21 17:56:19', NULL),
(4, 13, 5, '2023-02-21 17:56:19', NULL),
(5, 8, 4, '2023-02-21 17:56:58', NULL),
(6, 14, 6, '2023-02-21 17:58:13', NULL),
(7, 14, 7, '2023-02-21 17:58:13', NULL),
(8, 17, 8, '2023-02-21 17:59:40', NULL),
(9, 17, 9, '2023-02-21 17:59:40', NULL),
(10, 17, 10, '2023-02-21 17:59:40', NULL),
(11, 17, 11, '2023-02-21 17:59:40', NULL),
(12, 18, 8, '2023-02-21 17:59:40', NULL),
(13, 18, 9, '2023-02-21 17:59:40', NULL),
(14, 18, 10, '2023-02-21 17:59:40', NULL),
(15, 18, 11, '2023-02-21 17:59:40', NULL),
(16, 6, 12, '2023-02-21 18:01:44', NULL),
(17, 6, 13, '2023-02-21 18:01:44', NULL),
(18, 9, 14, '2023-02-21 18:02:51', NULL),
(19, 9, 17, '2023-02-21 18:02:51', NULL),
(20, 10, 15, '2023-02-21 18:04:18', NULL),
(21, 12, 15, '2023-02-21 18:04:18', NULL),
(22, 16, 16, '2023-02-21 18:05:29', NULL);

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
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `Stu_group` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `groupStudent_group_foreign_idx` (`Stu_group`),
  KEY `groupStudent_student_foreign_idx` (`Student`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `groups_for_students`
--

INSERT INTO `groups_for_students` (`id`, `Student`, `Stu_group`, `create_time`, `update_time`) VALUES
(1, 1, 1, '2023-02-21 17:34:33', NULL),
(2, 3, 1, '2023-02-21 17:34:33', NULL),
(3, 4, 1, '2023-02-21 17:34:33', NULL),
(4, 5, 2, '2023-02-21 17:38:00', NULL),
(5, 6, 2, '2023-02-21 17:38:00', NULL),
(6, 1, 3, '2023-02-21 17:40:07', NULL),
(7, 3, 3, '2023-02-21 17:40:07', NULL),
(8, 4, 3, '2023-02-21 17:40:07', NULL),
(9, 5, 4, '2023-02-21 17:40:07', NULL),
(10, 6, 4, '2023-02-21 17:40:07', NULL),
(11, 7, 5, '2023-02-21 17:40:07', NULL),
(12, 8, 5, '2023-02-21 17:40:07', NULL),
(13, 1, 8, '2023-02-21 17:42:46', NULL),
(14, 3, 8, '2023-02-21 17:42:46', NULL),
(15, 4, 9, '2023-02-21 17:42:46', NULL),
(16, 5, 9, '2023-02-21 17:42:46', NULL),
(17, 6, 10, '2023-02-21 17:42:46', NULL),
(18, 7, 10, '2023-02-21 17:42:46', NULL),
(19, 8, 11, '2023-02-21 17:42:46', NULL),
(20, 9, 12, '2023-02-21 17:44:18', NULL),
(21, 10, 12, '2023-02-21 17:44:18', NULL),
(22, 11, 13, '2023-02-21 17:44:18', NULL),
(23, 12, 13, '2023-02-21 17:44:18', NULL),
(24, 9, 14, '2023-02-21 17:45:47', NULL),
(25, 10, 14, '2023-02-21 17:45:47', NULL),
(26, 11, 15, '2023-02-21 17:45:47', NULL),
(27, 12, 15, '2023-02-21 17:45:47', NULL),
(31, 8, 16, '2023-02-21 17:49:54', NULL),
(30, 7, 16, '2023-02-21 17:49:54', NULL),
(32, 1, 17, '2023-02-21 17:51:06', NULL),
(33, 3, 17, '2023-02-21 17:51:06', NULL),
(34, 4, 17, '2023-02-21 17:51:06', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `medical_forms`
--

DROP TABLE IF EXISTS `medical_forms`;
CREATE TABLE IF NOT EXISTS `medical_forms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Student` int NOT NULL,
  `Session` int NOT NULL,
  `Medical_form` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
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
  `Code` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Department` int UNSIGNED NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `module_faculty_foreign_idx` (`Faculty`),
  KEY `module_department_foreign_idx` (`Department`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `Code`, `Name`, `Faculty`, `Department`, `create_time`, `update_time`) VALUES
(1, 'IN1000', 'Programming Fundamentals', 1, 1, '2023-02-18 07:53:47', NULL),
(2, 'IN1001', 'Digital Systems Design', 1, 1, '2023-02-18 07:53:57', NULL),
(3, 'CM1000', 'Fundamentals of Mathematics', 1, 2, '2023-02-18 07:54:15', NULL),
(4, 'CM1001', 'Elements of Statistics', 1, 2, '2023-02-18 07:54:30', NULL),
(5, 'IS1000', 'English', 1, 5, '2023-02-18 07:57:16', NULL),
(6, 'IN1002', 'Multimedia Technologies', 1, 1, '2023-02-21 17:15:48', NULL),
(7, 'IN1003', 'Fundamentals of Databases', 1, 1, '2023-02-21 17:16:36', NULL),
(8, 'IN1004', 'Data Structures and Algorithms', 1, 1, '2023-02-21 17:17:04', NULL),
(9, 'IN1005', 'Data Communication', 1, 1, '2023-02-21 17:17:28', NULL),
(10, 'IN1006', 'Web Technologies', 1, 1, '2023-02-21 17:18:05', NULL),
(11, 'IS1001', 'Principles of Management', 1, 5, '2023-02-21 17:18:26', NULL),
(12, 'IS1002', 'Business Recognition', 1, 5, '2023-02-21 17:18:50', NULL),
(13, 'IN1007', 'AI Principles', 1, 1, '2023-02-21 17:19:09', NULL);

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
  `Ses_group` int NOT NULL,
  `Start_time` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Duration` double NOT NULL,
  `Method` tinyint NOT NULL COMMENT '0 - physical, 1 - online',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `Type` int NOT NULL COMMENT '0 - lecture, 1 - lab, 2 - assignment, 3 - exam',
  PRIMARY KEY (`id`),
  KEY `session_group_foreign_idx` (`Ses_group`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `Ses_group`, `Start_time`, `Duration`, `Method`, `create_time`, `update_time`, `Type`) VALUES
(1, 1, '2023-03-10 08:15:00', 2, 0, '2023-03-07 18:59:34', NULL, 0),
(2, 3, '2023-03-05 08:15:00', 2, 0, '2023-03-07 19:01:38', NULL, 0),
(3, 8, '2023-03-08 13:15:00', 2, 0, '2023-03-07 19:02:26', NULL, 0),
(4, 17, '2023-03-10 10:30:00', 2, 0, '2023-03-07 19:03:03', NULL, 0),
(5, 1, '2023-03-17 10:30:00', 2, 0, '2023-03-28 06:03:34', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` int NOT NULL,
  `IndexNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Uid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Telephone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Faculty` int UNSIGNED NOT NULL,
  `Degree` int NOT NULL,
  `Batch` int NOT NULL,
  `Academic_Advisor` int UNSIGNED NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Email_verified_at` timestamp NULL DEFAULT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `Api_token` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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

INSERT INTO `students` (`id`, `IndexNo`, `Uid`, `Name`, `Telephone`, `Address`, `Faculty`, `Degree`, `Batch`, `Academic_Advisor`, `Email`, `Email_verified_at`, `Password`, `Api_token`, `Remember_token`, `created_at`, `updated_at`) VALUES
(1, '214001P', '214001', 'AMBEYPITIYA S.B.', '1111', 'Colombo, Sri Lanka.', 1, 1, 2, 6, 'sankha@uom.lk', NULL, 'sb', NULL, NULL, NULL, NULL),
(3, '214002P', '214002', 'Lakmina Pramodya', '2222', 'Colombo, Sri Lanka.', 1, 1, 2, 7, 'lakmina@uom.lk', NULL, 'lp', NULL, NULL, NULL, NULL),
(4, '214003P', '214003', 'Iman Thiyanga', '3333', 'Colombo, Sri Lanka.', 1, 1, 2, 8, 'iman@uom.lk', NULL, 'it', NULL, NULL, NULL, NULL),
(5, '214004P', '214004', 'Malintha Kavinda', '4444', 'Colombo, Sri Lanka.', 1, 5, 2, 9, 'malintha@uom.lk', NULL, 'mk', NULL, NULL, NULL, NULL),
(6, '214005P', '214005', 'Kasun Jayasankha', '5555', 'Colombo, Sri Lanka.', 1, 5, 2, 10, 'kasun@uom.lk', NULL, 'kj', NULL, NULL, NULL, NULL),
(7, '214006P', '214006', 'Ravindu Pabasara', '5555', 'Colombo, Sri Lanka.', 1, 2, 2, 11, 'ravindu@uom.lk', NULL, 'rp', NULL, NULL, NULL, NULL),
(8, '214007P', '214007', 'Tharuka Perera', '6666', 'Colombo, Sri Lanka.', 1, 2, 2, 12, 'tharuka@uom.lk', NULL, 'tp', NULL, NULL, NULL, NULL),
(9, '214008P', '214008', 'John P.', '6666', 'Colombo, Sri Lanka.', 1, 1, 1, 14, 'john@uom.lk', NULL, 'jp', NULL, NULL, NULL, NULL),
(10, '214009P', '214009', 'Alex P.', '7777', 'Colombo, Sri Lanka.', 1, 1, 1, 18, 'alex@uom.lk', NULL, 'ap', NULL, NULL, NULL, NULL),
(11, '214010P', '214010', 'George P.', '8888', 'Colombo, Sri Lanka.', 1, 5, 1, 17, 'george@uom.lk', NULL, 'gp', NULL, NULL, NULL, NULL),
(12, '214011P', '214011', 'Sean P.', '8888', 'Colombo, Sri Lanka.', 1, 5, 1, 16, 'sean@uom.lk', NULL, 'sp', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `student_groups`
--

DROP TABLE IF EXISTS `student_groups`;
CREATE TABLE IF NOT EXISTS `student_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(45) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `Module` int NOT NULL,
  `Batch` int NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `group_module_foreign_idx` (`Module`),
  KEY `group_batch_foreign_idx` (`Batch`)
) ENGINE=MyISAM AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `student_groups`
--

INSERT INTO `student_groups` (`id`, `Name`, `Module`, `Batch`, `create_time`, `update_time`) VALUES
(5, 'mod2-grp3', 2, 2, '2023-02-21 17:21:40', NULL),
(4, 'mod2-grp2', 2, 2, '2023-02-21 17:21:31', NULL),
(3, 'mod2-grp1', 2, 2, '2023-02-21 17:21:04', NULL),
(2, 'mod1-grp2', 1, 2, '2023-02-21 17:20:49', NULL),
(1, 'mod1-grp1', 1, 2, '2023-02-21 17:20:36', NULL),
(6, 'mod3-grp1', 3, 2, '2023-02-21 17:22:21', NULL),
(7, 'mod3-grp2', 3, 2, '2023-02-21 17:22:38', NULL),
(8, 'Eng-A1', 5, 2, '2023-02-21 17:23:13', NULL),
(9, 'Eng-A2', 5, 2, '2023-02-21 17:23:28', NULL),
(10, 'Eng-B1', 5, 2, '2023-02-21 17:23:37', NULL),
(11, 'Eng-B2', 5, 2, '2023-02-21 17:23:44', NULL),
(12, 'mod7-grp1', 7, 1, '2023-02-21 17:24:30', NULL),
(13, 'mod7-grp2', 7, 1, '2023-02-21 17:24:38', NULL),
(14, 'mod8-grp1', 8, 1, '2023-02-21 17:25:12', NULL),
(15, 'mod12-grp1', 12, 1, '2023-02-21 17:25:46', NULL),
(16, 'mod13-grp1', 13, 2, '2023-02-21 17:27:33', NULL),
(17, 'mod8-grp2', 8, 2, '2023-02-21 17:29:09', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `timetable`
--

DROP TABLE IF EXISTS `timetable`;
CREATE TABLE IF NOT EXISTS `timetable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `T_group` int NOT NULL,
  `Day` int UNSIGNED NOT NULL,
  `Start_time` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `End_time` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timetable_groups_foreign_idx` (`T_group`)
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
