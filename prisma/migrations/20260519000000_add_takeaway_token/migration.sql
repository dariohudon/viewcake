-- AlterTable: add takeawayToken column to AudienceParticipant
ALTER TABLE "AudienceParticipant" ADD COLUMN "takeawayToken" TEXT;

-- CreateIndex: unique constraint on takeawayToken
CREATE UNIQUE INDEX "AudienceParticipant_takeawayToken_key" ON "AudienceParticipant"("takeawayToken");
