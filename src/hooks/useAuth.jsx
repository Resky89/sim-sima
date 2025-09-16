import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// Definisikan hook sebagai default export
export default function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Re-export hook sebagai named export untuk backward compatibility
export { useAuth };
