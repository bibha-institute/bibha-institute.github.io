PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_interest_signups` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`location` text NOT NULL,
	`interests` text NOT NULL,
	`contribution` text,
	`consent` integer DEFAULT 1 NOT NULL,
	`consent_version` text DEFAULT '2026-08-bibha-v2.1' NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`admin_note` text,
	`followed_up_at` integer,
	`updated_at` integer,
	`source` text,
	`confirmation_email_status` text DEFAULT 'not_configured' NOT NULL,
	`owner_email_status` text DEFAULT 'not_configured' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_interest_signups`("id", "created_at", "name", "email", "role", "location", "interests", "contribution", "consent", "consent_version", "status", "admin_note", "followed_up_at", "updated_at", "source", "confirmation_email_status", "owner_email_status") SELECT "id", "created_at", "name", "email", "role", "location", "interests", "contribution", "consent", "consent_version", "status", "admin_note", "followed_up_at", "updated_at", "source", "confirmation_email_status", "owner_email_status" FROM `interest_signups`;--> statement-breakpoint
DROP TABLE `interest_signups`;--> statement-breakpoint
ALTER TABLE `__new_interest_signups` RENAME TO `interest_signups`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_interest_email` ON `interest_signups` (`email`);