import { Credentials, LoginResponse, PasswordData, UpdateData, User, UserData } from '../Types';
import { $axios } from '../services/axios'

// receives userData object
// returns user creation response
export const createUser = async (userData: UserData): Promise<User> => {
    const { data } = await $axios.post('/users', userData);
    return data;
}

// returns array of all users
export const getAllUsers = async (): Promise<User[]> => {
    const { data } = await $axios.get('/users');
    return data;
}

// receives userId
// returns user data
export const getOneUser = async (userId: string): Promise<User> => {
    const { data } = await $axios.get(`/users/${userId}`);
    return data;
}

// receives credentials object
// returns login response with user data and session info
export const loginUser = async (credentials: Credentials): Promise<LoginResponse> => {
    const { data } = await $axios.post('/users/login', credentials)
    return data
}

// receives userId
// returns logout response
export const logoutUser = async (userId: string): Promise<{ message: string }> => {
    const { data } = await $axios.put(`/users/logout/${userId.toString()}`);
    return data;
}

// returns session status
export const checkSession = async (): Promise<any> => {
    const { data } = await $axios.post('/users/check-session');
    return data;
}

// receives userId
// returns deletion response
export const deleteUser = async (userId: string): Promise<{ message: string }> => {
    const { data } = await $axios.delete(`/users/${userId}`);
    return data;
}

// receives userId and updateData object
// returns updated user data
export const updateUser = async (userId: string, updateData: UpdateData): Promise<User> => {
    const { data } = await $axios.put(`/users/${userId}`, updateData);
    return data;
}

// receives userId and passwordData object
// returns password change response
export const changePassword = async (userId: string, passwordData: PasswordData): Promise<{ message: string }> => {
    const { data } = await $axios.put(`/users/${userId}/password`, passwordData);
    return data;
}

// returns current user's profile data
export const getCurrentUser = async (): Promise<User> => {
    const { data } = await $axios.get('/users/profile');
    return data;
}
