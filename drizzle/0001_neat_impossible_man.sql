CREATE TABLE `apis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`client_id` int NOT NULL,
	`token` varchar(255) NOT NULL,
	`expires_in` int NOT NULL,
	`url_callback_status` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `apis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `apis` ADD CONSTRAINT `apis_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE restrict ON UPDATE no action;