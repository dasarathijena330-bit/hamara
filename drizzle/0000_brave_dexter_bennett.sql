CREATE TABLE `loans` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`borrower_name` text NOT NULL,
	`amount` real NOT NULL,
	`interest_rate` real NOT NULL,
	`start_date` text NOT NULL,
	`notes` text,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
