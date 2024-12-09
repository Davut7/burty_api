/*
  Warnings:

  - The values [facebook] on the enum `auth_providers` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "auth_providers_new" AS ENUM ('google', 'email');
ALTER TABLE "users" ALTER COLUMN "provider" TYPE "auth_providers_new" USING ("provider"::text::"auth_providers_new");
ALTER TYPE "auth_providers" RENAME TO "auth_providers_old";
ALTER TYPE "auth_providers_new" RENAME TO "auth_providers";
DROP TYPE "auth_providers_old";
COMMIT;
