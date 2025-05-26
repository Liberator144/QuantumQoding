/**
 * User Types
 *
 * This module provides type definitions for user management.
 *
 * @version 1.0.0
 */
// User Role and Status
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["MODERATOR"] = "moderator";
    UserRole["USER"] = "user";
    UserRole["GUEST"] = "guest";
    UserRole["QUANTUM_ARCHITECT"] = "quantum_architect";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
    UserStatus["SUSPENDED"] = "suspended";
    UserStatus["PENDING"] = "pending";
    UserStatus["QUANTUM_ENTANGLED"] = "quantum_entangled";
})(UserStatus || (UserStatus = {}));
// Type Guards
export const isValidUserRole = (role) => {
    return Object.values(UserRole).includes(role);
};
export const isValidUserStatus = (status) => {
    return Object.values(UserStatus).includes(status);
};
export const isUser = (obj) => {
    return typeof obj === 'object' && obj !== null &&
        'id' in obj && 'username' in obj && 'email' in obj;
};
