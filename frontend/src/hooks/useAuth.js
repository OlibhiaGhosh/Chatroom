// This file will return every context available in the AuthContext like auth, setAuth, etc. when useAuth() hook is called.
// It also provides a debug value to indicate whether the user is logged in or logged out.

import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthProvider.jsx";

const useAuth = () => {
  const { auth } = useContext(AuthContext);
  useDebugValue(auth, (auth) => (auth?.user ? "Logged In" : "Logged Out"));
  return useContext(AuthContext);
};

export default useAuth;
