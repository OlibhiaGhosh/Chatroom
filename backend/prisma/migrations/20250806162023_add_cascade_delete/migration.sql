-- DropForeignKey
ALTER TABLE "public"."UserChatroom" DROP CONSTRAINT "UserChatroom_chatroomId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UserChatroom" DROP CONSTRAINT "UserChatroom_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."UserChatroom" ADD CONSTRAINT "UserChatroom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserChatroom" ADD CONSTRAINT "UserChatroom_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."message" ADD CONSTRAINT "message_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "public"."Chatroom"("room_id") ON DELETE CASCADE ON UPDATE CASCADE;
