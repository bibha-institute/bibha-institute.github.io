CREATE TABLE `founder_auth_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`code_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`consumed_at` integer
);
--> statement-breakpoint
CREATE INDEX `idx_founder_auth_codes_email_created` ON `founder_auth_codes` (`email`,`created_at`);--> statement-breakpoint
CREATE TABLE `founder_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`last_seen_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_founder_sessions_expires` ON `founder_sessions` (`expires_at`);