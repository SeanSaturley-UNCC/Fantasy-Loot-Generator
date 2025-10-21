import $axios from './Axios';

// receives userData object
// returns user creation response
export function createUser(userData) {
    return $axios.post('/users', userData).then(d => d.data);
}

// returns array of all users
export function getAllUsers() {
    return $axios.get('/users').then(d => d.data);
}

// receives userId
// returns user data
export function getOneUser(userId) {
    return $axios.get(`/users/${userId}`).then(d => d.data);
}

// receives credentials object
// returns login response with user data and session info
export function loginUser(credentials) {
    return $axios.post('/users/login', credentials).then(d => d.data);
}

// receives userId
// returns logout response
export function logoutUser(userId) {
    return $axios.put(`/users/logout/${userId}`).then(d => d.data);
}

// returns session status
export function checkSession() {
    return $axios.post('/users/check-session').then(d => d.data);
}

// receives userId
// returns deletion response
export function deleteUser(userId) {
    return $axios.delete(`/users/${userId}`).then(d => d.data);
}

// receives userId and updateData object
// returns updated user data
export function updateUser(userId, updateData) {
    return $axios.put(`/users/${userId}`, updateData).then(d => d.data);
}

// receives userId and passwordData object
// returns password change response
export function changePassword(userId, passwordData) {
    return $axios.put(`/users/${userId}/password`, passwordData).then(d => d.data);
}

// returns current user's profile data
export function getCurrentUser() {
    return $axios.get('/users/profile').then(d => d.data);
}
