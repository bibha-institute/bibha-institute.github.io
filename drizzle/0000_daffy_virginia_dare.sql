CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`audience` text NOT NULL,
	`rating` integer NOT NULL,
	`message` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `interest_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`location` text NOT NULL,
	`interests` text NOT NULL,
	`contribution` text,
	`consent` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_interest_email` ON `interest_signups` (`email`);