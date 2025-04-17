/*
  Warnings:

  - You are about to drop the column `light_pattern_id` on the `device_profiles` table. All the data in the column will be lost.
  - You are about to drop the `light_patterns` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "device_profiles" DROP CONSTRAINT "device_profiles_light_pattern_id_fkey";

-- AlterTable
ALTER TABLE "device_profiles" DROP COLUMN "light_pattern_id",
ADD COLUMN     "light_scene_id" UUID;

-- DropTable
DROP TABLE "light_patterns";

-- CreateTable
CREATE TABLE "light_scenes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "light_scenes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "light_scenes_name_key" ON "light_scenes"("name");

-- AddForeignKey
ALTER TABLE "device_profiles" ADD CONSTRAINT "device_profiles_light_scene_id_fkey" FOREIGN KEY ("light_scene_id") REFERENCES "light_scenes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
