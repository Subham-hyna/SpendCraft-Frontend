export interface User {
    _id: string;
    email: string;
    name: string;
    photo_uri: string;
}

export interface GoogleLoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LogoutResponse {
    message: string;
}