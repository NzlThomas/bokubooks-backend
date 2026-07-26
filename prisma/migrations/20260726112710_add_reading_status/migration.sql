-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('TO_READ', 'READING', 'READ');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "readingStatus" "ReadingStatus" NOT NULL DEFAULT 'TO_READ';

UPDATE "Book"
SET "readingStatus" =
CASE
    WHEN "totalVolumes" IS NULL OR "totalVolumes" = 0 THEN 'TO_READ'::"ReadingStatus"
    WHEN "totalRead" = 0 THEN 'TO_READ'::"ReadingStatus"
    WHEN "totalRead" = "totalVolumes" THEN 'READ'::"ReadingStatus"
    ELSE 'READING'::"ReadingStatus"
END;