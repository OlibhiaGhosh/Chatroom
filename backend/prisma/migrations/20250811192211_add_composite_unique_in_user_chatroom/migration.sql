/*
  Warnings:

  - A unique constraint covering the columns `[userId,chatroomId]` on the table `UserChatroom` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserChatroom_userId_chatroomId_key" ON "public"."UserChatroom"("userId", "chatroomId");
