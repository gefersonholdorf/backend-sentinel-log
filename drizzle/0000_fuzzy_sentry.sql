CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('super_admin','admin','member') NOT NULL,
	`email` varchar(255) NOT NULL,
	`cpf` varchar(14) NOT NULL,
	`password` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`client_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`),
	CONSTRAINT `users_cpf_unique` UNIQUE(`cpf`)
);
