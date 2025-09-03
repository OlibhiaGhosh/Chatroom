/*
  Warnings:

  - The primary key for the `Chatroom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discardedAt` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Chatroom` table. All the data in the column will be lost.
  - You are about to drop the column `discardedAt` on the `UserChatroom` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `UserChatroom` table. All the data in the column will be lost.
  - The primary key for the `message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `message` table. All the data in the column will be lost.
  - The `content` column on the `message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[refreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `room_id` was added to the `Chatroom` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "public"."UserChatroom" DROP CONSTRAINT "UserChatroom_chatroomId_fkey";

-- AlterTable
ALTER TABLE "public"."Chatroom" DROP CONSTRAINT "Chatroom_pkey",
DROP COLUMN "discardedAt",
DROP COLUMN "id",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "members" JSONB[],
ADD COLUMN     "room_id" TEXT NOT NULL,
ADD CONSTRAINT "Chatroom_pkey" PRIMARY KEY ("room_id");

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "refreshToken" TEXT;

-- AlterTable
ALTER TABLE "public"."UserChatroom" DROP COLUMN "discardedAt",
DROP COLUMN "isActive";

-- AlterTable
ALTER TABLE "public"."message" DROP CONSTRAINT "message_pkey",
DROP COLUMN "id",
DROP COLUMN "content",
ADD COLUMN     "content" JSONB[],
ADD CONSTRAINT "message_pkey" PRIMARY KEY ("chatroomId");

-- CreateIndex
CREATE UNIQUE INDEX "User_refreshToken_key" ON "public"."User"("refreshToken");

-- AddForeignKey
ALTER TABLE "public"."UserChatroom" ADD CONSTRAINT "UserChatroom_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;
