import { createContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService.js";
import { getUser, isAuthenticated } from "../utils/auth.js";

const AuthContext = createContext();

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const initialState = {
  user: getUser(),
  isAuthenticated: isAuthenticated(),
  loading: true, // Start with loading true to check authentication
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check if user is still authenticated on app load
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const user = await authService.getProfile();
          dispatch({ type: "SET_USER", payload: user });
        } catch (error) {
          console.error("Auth check failed:", error);
          dispatch({ type: "LOGOUT" });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
      dispatch({ type: "SET_LOADING", payload: false });
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authService.login(email, password);
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: response.data.user },
      });
      return response;
    } catch (error) {
      dispatch({
        type: "LOGIN_ERROR",
        payload: error.message,
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const setUser = (user) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  const value = {
    ...state,
    login,
    logout,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook moved to a separate file to fix HMR issues
// Now we export the context itself so it can be imported in the hook file
export { AuthContext };
