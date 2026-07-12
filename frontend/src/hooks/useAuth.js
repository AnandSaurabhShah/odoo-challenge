import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../lib/api.js";
import { useAssetStore } from "../store/useAssetStore.js";

export const AUTH_QUERY_KEY = ["me"];

/**
 * Fetches the current authenticated user from GET /api/auth/me.
 * Returns null (not throws) when the user is not logged in (401),
 * so the app can render the LoginPage instead of an error boundary.
 *
 * retry: false  — don't hammer the server on 401
 * staleTime    — re-validate every 5 minutes
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        const res = await authApi.me();
        return res.user ?? null;
      } catch (err) {
        if (err.status === 401) return null;
        throw err;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Sends POST /api/auth/login and, on success, invalidates the 'me' query
 * so the app immediately knows a user is now authenticated.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const setActiveScreen = useAssetStore((state) => state.setActiveScreen);

  return useMutation({
    mutationFn: ({ email, password }) => authApi.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      setActiveScreen("dashboard");
    },
  });
}

/**
 * Sends POST /api/auth/register (public endpoint).
 * Creates an EMPLOYEE account — role is set server-side, not sent from UI.
 * On success, does NOT auto-login; user is redirected to login page.
 */
export function useRegisterMutation() {
  return useMutation({
    mutationFn: ({ fullName, email, password, departmentId }) =>
      authApi.register({ fullName, email, password, departmentId }),
  });
}

/**
 * Sends POST /api/auth/logout and clears the cached user, returning
 * the app to the LoginPage.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const setActiveScreen = useAssetStore((state) => state.setActiveScreen);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Immediately wipe out the cached user — no need to refetch
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY });
      setActiveScreen("dashboard");
    },
    onError: () => {
      // Even if the network call fails, clear local session
      queryClient.setQueryData(AUTH_QUERY_KEY, null);
      setActiveScreen("dashboard");
    },
  });
}
