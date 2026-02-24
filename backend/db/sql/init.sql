
-- public.tbl_user definition

CREATE TABLE `tbl_user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` varchar(36) NOT NULL,
  `provider_id` varchar(100) NOT NULL,
  `encrypted_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(2048) DEFAULT NULL,
  `provider` varchar(100) NOT NULL,
  `loc` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `provider_id` (`provider_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_session definition

CREATE TABLE `tbl_session` (
  `session_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `refresh_token` varchar(255) NOT NULL,
  `is_revoked` tinyint NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `expires_at` timestamp NOT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_team definition

CREATE TABLE `tbl_team` (
  `team_id` varchar(36) NOT NULL,
  `icon` varchar(36) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`team_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_team_user definition

CREATE TABLE `tbl_team_user` (
  `team_id` varchar(36) NOT NULL,
  `user_id` varchar(36) NOT NULL,
  `role` varchar(50) DEFAULT 'member',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  UNIQUE KEY `uq_team_user` (`team_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_email_notification definition

CREATE TABLE `tbl_email_notification` (
  `notification_id` varchar(36) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `send_at` timestamp NOT NULL,
  `send_by` varchar(50) NOT NULL,
  `send_to` varchar(50) DEFAULT NULL,
  `team_id` varchar(36) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`notification_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_task definition

CREATE TABLE `tbl_task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `task_id` varchar(36) NOT NULL,
  `task_type` varchar(36) NOT NULL,
  `team_id` varchar(36) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'todo',
  `created_at` timestamp NOT NULL DEFAULT (now()),
  `updated_at` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`task_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- public.tbl_user_task_calendar definition

CREATE TABLE `tbl_user_task_calendar` (
  `user_id` varchar(36) NOT NULL,
  `task_id` varchar(36) NOT NULL,
  `task_calendar_id` varchar(36) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'pending',
  `start_date` timestamp NOT NULL,
  `end_date` timestamp NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uq_user_task_calendar` (`user_id`,`task_calendar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;