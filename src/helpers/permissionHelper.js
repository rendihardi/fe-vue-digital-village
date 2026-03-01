import { useAuthStore } from "@/stores/auth";

export const can = (permission) => {
  const authStore = useAuthStore();

  const userPermissions = authStore.user?.permissions || [];

  return userPermissions.includes(permission);
};

export const canRole = (role) => {
  if (!role) return true; // <-- ini penting
  const authStore = useAuthStore();
  return authStore.user?.role === role;
};

/**
 * Cek role tunggal
 */
// export const canRole = (role) => {
//   const authStore = useAuthStore();
//   const userRole = authStore.user?.role;

//   return userRole === role;
// };

/**
 * Cek multiple role
 */
export const canAnyRole = (roles = []) => {
  const authStore = useAuthStore();
  const userRole = authStore.user?.role;

  return roles.includes(userRole);
};
