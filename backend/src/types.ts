export interface message_content{
    user_id: string;
    message: string;
}

export interface user {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface JWT_payload {
    id: string; 
    username: string;
}
export interface cookie_options{
    httpOnly: true,
    secure: true,
}

export interface members_schema{
    userId: string;
    username: string;
}
export interface userChatroom {
    id: string;
    userId: string;
    chatroomId: string;
    createdAt: Date
}