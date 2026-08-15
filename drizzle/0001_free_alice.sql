CREATE TABLE `submission_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer DEFAULT 1 NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `feedback` ADD `email` text;--> statement-breakpoint
ALTER TABLE `feedback` ADD `status` text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `feedback` ADD `source` text;--> statement-breakpoint
ALTER TABLE `feedback` ADD `notification_email_status` text DEFAULT 'not_configured' NOT NULL;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `consent_version` text DEFAULT '2026-08-v2.1' NOT NULL;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `status` text DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `admin_note` text;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `followed_up_at` integer;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `updated_at` integer;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `source` text;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `confirmation_email_status` text DEFAULT 'not_configured' NOT NULL;--> statement-breakpoint
ALTER TABLE `interest_signups` ADD `owner_email_status` text DEFAULT 'not_configured' NOT NULL;