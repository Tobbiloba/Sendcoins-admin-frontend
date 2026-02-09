import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useLocation } from "wouter";
import { authService, LoginCredentials } from "../services/authService";
import {
  setCredentials,
  logout as logoutAction,
} from "../store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      setLocation("/dashboard");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      dispatch(logoutAction());
      queryClient.clear();
      setLocation("/login");
    },
    onError: () => {
      // Force logout on client even if server fails
      dispatch(logoutAction());
      queryClient.clear();
      setLocation("/login");
    },
  });

  return {
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
  };
};
