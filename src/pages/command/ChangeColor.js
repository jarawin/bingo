import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function ChangeColor() {
  const randomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-gray-400",
      "bg-orange-500",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return color;
  };

  useEffect(() => {
    const nowColor = localStorage.getItem("color");
    const color = randomColor();
    if (nowColor != color) {
      localStorage.setItem("color", color);
      document.body.classList.value = color;
    } else {
      window.location.reload();
    }
  }, []);

  return <Navigate to="/" />;
}

export default ChangeColor;
