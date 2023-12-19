-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3308
-- Generation Time: Dec 19, 2023 at 06:01 AM
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
(5, 'BSc. (ITM)', 1, 5, '2023-02-21 17:07:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `degree_of_groups`
--

DROP TABLE IF EXISTS `degree_of_groups`;
CREATE TABLE IF NOT EXISTS `degree_of_groups` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Stu_group` int NOT NULL,
  `Degree` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--


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
(4, 'Dean'),
(5, 'Non Academic');

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
) ENGINE=InnoDB AUTO_INCREMENT=1178 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(18, 'lec1012', '1012', 'Dilanthi Fernando', '5555', 'Colombo, Sri Lanka.', 1, 5, 1, NULL, NULL, 'dilanthi@uom.lk', NULL, 'df', NULL, NULL),
(19, 'empna1000', '15426', 'Nuwan Perera', '0710424155', 'Piliyandala', 1, 1, 5, NULL, NULL, 'nuwanp@uom.lk', NULL, 'sf', NULL, NULL),
(20, 'lec1013', '1013', 'Akila Warnapura', '123456789', 'Gampaha', 1, 1, 1, NULL, NULL, 'akila@uom.lk', NULL, 'aw', NULL, NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--

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
(1, 'Faculty of Information Technology');

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
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--

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
  `id` int NOT NULL AUTO_INCREMENT,
  `Ses_group` int NOT NULL,
  `Start_time` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Duration` double NOT NULL,
  `Method` tinyint NOT NULL COMMENT '0 - physical, 1 - online',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  `Type` int NOT NULL COMMENT '0 - lecture, 1 - lab, 2 - assignment, 3 - exam',
  `Lecturer` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `session_group_foreign_idx` (`Ses_group`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--

-- --------------------------------------------------------

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
CREATE TABLE IF NOT EXISTS `students` (
  `id` bigint NOT NULL,
  `IndexNo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
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

INSERT INTO `students` (`id`, `IndexNo`, `Name`, `Telephone`, `Address`, `Faculty`, `Degree`, `Batch`, `Academic_Advisor`, `Email`, `Email_verified_at`, `Password`, `Api_token`, `Remember_token`, `created_at`, `updated_at`) VALUES
(1001, '215001P', 'KAVINDA R.L.M.', '071000001', 'Matara', 1, 5, 2, 9, 'kavindarlm.21@uom.lk', NULL, 'mkr', NULL, NULL, NULL, NULL),
(1002, '2151002P', 'WEERASINGHE A.S.', '071000002', 'Kekanadura', 1, 5, 2, 12, 'weerasingheas.21@uom.lk', NULL, 'asw', NULL, NULL, NULL, NULL),
(1003, '2161003P', 'GAYUNI A.B.C.', '071000003', 'Kandy', 1, 2, 2, 17, 'gayuniabc.21@uom.lk', NULL, 'gab', '\r\n', NULL, NULL, NULL),
(1004, '2161004P', 'DUSHAN J.', '071000004', 'Galle', 1, 2, 2, 18, 'dushanj.21@upm.lk', NULL, 'dj', NULL, NULL, NULL, NULL),
(1005, '214034C', 'BHAGYA L.G.V.', '011223366', 'Weligama, Matara.', 1, 1, 2, 9, 'bhagya@uom.lk', NULL, 'vb', NULL, NULL, NULL, NULL),
(1006, '2151006P', 'JAYASANKHA K.', '8974563210', 'Badulla, Sri Lanka.', 1, 5, 2, 9, 'kasun@uom.lk', NULL, 'kj', NULL, NULL, NULL, NULL),
(1007, '2151007P', 'PERERA E.', '4561237890', 'Panadura, Sri Lanka.', 1, 2, 2, 10, 'eranda@uom.lk', NULL, 'ep', '\r\n', NULL, NULL, NULL),
(194723197, '214014P', 'AMBEYPITIYA S.B.', '0710424155', 'Matara', 1, 1, 2, 6, 'ambeypitiyasb.21@uom.lk', NULL, 'sba', NULL, NULL, NULL, NULL),
(574269898, '214065V', 'GAMAGE L.P.G.', '0768000029', 'Yatiyata', 1, 1, 2, 8, ' gamagelpg.21@uom.lk', NULL, 'lpg', NULL, NULL, NULL, NULL);

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--

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
  `Duration` double DEFAULT '0',
  `Method` int NOT NULL COMMENT '0 - physical, 1 - online',
  `Type` int NOT NULL COMMENT '0 - lecture, 1 - lab, 2 - assignment, 3 - exam	',
  `Session_repeat` int NOT NULL COMMENT '0 - every week, 1- every other week',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `timetable_groups_foreign_idx` (`T_group`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COLLATE=utf8_unicode_ci;

--


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
