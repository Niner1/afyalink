CREATE TABLE `analyticsSnapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`snapshotDate` date NOT NULL,
	`activeClients` int,
	`newClients` int,
	`revenue` decimal(12,2),
	`appointmentsCompleted` int,
	`appointmentsPending` int,
	`outstandingBalance` decimal(12,2),
	`clientRetentionRate` decimal(5,2),
	`followUpAdherence` decimal(5,2),
	`riskDistribution` json,
	`topDiagnoses` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `analyticsSnapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `appointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`appointmentId` varchar(20) NOT NULL,
	`clientId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`appointmentDate` date NOT NULL,
	`appointmentTime` varchar(10) NOT NULL,
	`duration` int NOT NULL,
	`type` enum('New Patient','Follow-up','Walk-in') NOT NULL,
	`mode` enum('In-Person','Telehealth') NOT NULL,
	`status` enum('Confirmed','Pending','Completed','Scheduled') NOT NULL,
	`notes` text,
	`dietitianId` int,
	`dietitianName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `appointments_id` PRIMARY KEY(`id`),
	CONSTRAINT `appointments_appointmentId_unique` UNIQUE(`appointmentId`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` varchar(20) NOT NULL,
	`clientId` int NOT NULL,
	`assessmentDate` date NOT NULL,
	`dietitianId` int,
	`dietitianName` varchar(255),
	`height` decimal(5,2),
	`weight` decimal(5,2),
	`bmi` decimal(5,1),
	`bmiCategory` varchar(50),
	`waistCircumference` decimal(5,2),
	`bloodPressure` varchar(20),
	`bloodSugar` decimal(5,1),
	`dietaryAssessment` text,
	`foodRecall` text,
	`lifestyleEvaluation` text,
	`riskClassification` enum('Low Risk','Medium Risk','High Risk','Critical') NOT NULL,
	`nutritionDiagnosis` text,
	`notes` text,
	`weightHistory` json DEFAULT ('[]'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`),
	CONSTRAINT `assessments_assessmentId_unique` UNIQUE(`assessmentId`)
);
--> statement-breakpoint
CREATE TABLE `carePlans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`carePlanId` varchar(20) NOT NULL,
	`clientId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`createdDate` date NOT NULL,
	`updatedDate` date NOT NULL,
	`dietitianId` int,
	`dietitianName` varchar(255),
	`nutritionDiagnosis` text NOT NULL,
	`dietPrescription` text NOT NULL,
	`goals` json DEFAULT ('[]'),
	`mealPlanFile` varchar(255),
	`followUpNotes` json DEFAULT ('[]'),
	`status` enum('Active','Inactive','Completed') NOT NULL DEFAULT 'Active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `carePlans_id` PRIMARY KEY(`id`),
	CONSTRAINT `carePlans_carePlanId_unique` UNIQUE(`carePlanId`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clientId` varchar(20) NOT NULL,
	`userId` int,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(20),
	`email` varchar(320),
	`dateOfBirth` date,
	`age` int,
	`gender` enum('Male','Female','Other'),
	`address` text,
	`photoUrl` text,
	`status` enum('Active','Inactive') NOT NULL DEFAULT 'Active',
	`registrationDate` date NOT NULL,
	`medicalHistory` text,
	`currentDiagnoses` json DEFAULT ('[]'),
	`allergies` json DEFAULT ('[]'),
	`medications` json DEFAULT ('[]'),
	`lifestyle` json,
	`lastVisit` date,
	`nextAppointment` date,
	`totalVisits` int DEFAULT 0,
	`outstanding` decimal(10,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`),
	CONSTRAINT `clients_clientId_unique` UNIQUE(`clientId`)
);
--> statement-breakpoint
CREATE TABLE `invoiceItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` int NOT NULL,
	`description` varchar(255) NOT NULL,
	`quantity` int DEFAULT 1,
	`unitPrice` decimal(12,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `invoiceItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` varchar(20) NOT NULL,
	`clientId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`invoiceDate` date NOT NULL,
	`subtotal` decimal(12,2) NOT NULL,
	`discount` decimal(12,2) DEFAULT '0',
	`total` decimal(12,2) NOT NULL,
	`paid` decimal(12,2) DEFAULT '0',
	`outstanding` decimal(12,2) NOT NULL,
	`paymentMethod` enum('M-Pesa','Cash','Waived') NOT NULL,
	`status` enum('Paid','Partial','Pending','Waived') NOT NULL,
	`receiptNo` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceId_unique` UNIQUE(`invoiceId`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`messageId` varchar(20) NOT NULL,
	`clientId` int NOT NULL,
	`clientName` varchar(255) NOT NULL,
	`channel` enum('WhatsApp','SMS') NOT NULL,
	`direction` enum('Inbound','Outbound') NOT NULL,
	`message` text NOT NULL,
	`timestamp` timestamp NOT NULL DEFAULT (now()),
	`status` enum('Sent','Delivered','Read','Failed') NOT NULL,
	`type` enum('Reminder','Reply','Welcome','Alert','Other') DEFAULT 'Other',
	`senderId` int,
	`senderName` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`),
	CONSTRAINT `messages_messageId_unique` UNIQUE(`messageId`)
);
--> statement-breakpoint
CREATE TABLE `paymentRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceId` int NOT NULL,
	`amount` decimal(12,2) NOT NULL,
	`paymentMethod` enum('M-Pesa','Cash','Waived') NOT NULL,
	`paymentDate` date NOT NULL,
	`transactionId` varchar(100),
	`notes` text,
	`recordedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `paymentRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','dietitian','client') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);