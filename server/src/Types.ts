
export interface NoteType {
    author: string
    title: string
    content: string

    createdAt: Date
    updatedAt?: Date
    _id: string
}

export interface CreateNoteType {
    author: string
    title: string
    content: string
}

// Type definitions
export interface UserData {
    username: string;
    email: string;
    password: string;
}

export interface Credentials {
    username?: string;
    email?: string;
    password: string;
}

export interface User {
    _id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface LoginResponse {
    user: User;
    message?: string;
}

export interface UpdateData {
    username?: string;
    email?: string;
}

export interface PasswordData {
    currentPassword: string;
    newPassword: string;
}