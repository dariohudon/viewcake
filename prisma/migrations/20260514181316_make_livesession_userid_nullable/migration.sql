-- DropForeignKey
ALTER TABLE "LiveSession" DROP CONSTRAINT "LiveSession_userId_fkey";

-- AlterTable
ALTER TABLE "LiveSession" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LiveSession" ADD CONSTRAINT "LiveSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
