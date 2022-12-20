import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function ResetLocalStorage() {
  useEffect(() => {
    localStorage.clear();
  }, []);

  return <Navigate to="/" />;
}

export default ResetLocalStorage;
