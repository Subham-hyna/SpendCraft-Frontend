export interface User {
    _id: string;
    email: string;
    name: string;
    photo_uri: string;
    is_new_user: boolean;
}

export interface GoogleLoginResponse {
    user: User;
    access_token: string;
    refresh_token: string;
}

export interface LogoutResponse {
    message: string;
}

export interface Category {
    _id: string;
    name: string;
    color: string;
    icon: string;
    subcategories: Subcategory[];
}

export interface CreateUpdateCategoryResponse {
    category: Category;
}
export interface Subcategory {
    _id: string;
    name: string;
}