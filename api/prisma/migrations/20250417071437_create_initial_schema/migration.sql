/*
  Warnings:

  - You are about to drop the column `led_choreo_id` on the `device_profiles` table. All the data in the column will be lost.
  - You are about to drop the `led_choreos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "device_profiles" DROP CONSTRAINT "device_profiles_led_choreo_id_fkey";

-- AlterTable
ALTER TABLE "device_profiles" DROP COLUMN "led_choreo_id",
ADD COLUMN     "light_pattern_id" UUID;

-- DropTable
DROP TABLE "led_choreos";

-- CreateTable
CREATE TABLE "light_patterns" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "light_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "light_patterns_name_key" ON "light_patterns"("name");

-- AddForeignKey
ALTER TABLE "device_profiles" ADD CONSTRAINT "device_profiles_light_pattern_id_fkey" FOREIGN KEY ("light_pattern_id") REFERENCES "light_patterns"("id") ON DELETE SET NULL ON UPDATE CASCADE;
