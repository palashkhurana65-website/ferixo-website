"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export default function Toaster() {
  return (
    <HotToaster
      position="bottom-center"
      toastOptions={{
        // Define default styles to match your Dark/Premium theme
        style: {
          background: "rgba(19, 49, 89, 0.9)", // Deep Blue Glass
          color: "#fff",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "16px",
          borderRadius: "12px",
          fontSize: "14px",
          maxWidth: "400px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        },
        success: {
          iconTheme: {
            primary: "#4ADE80", // Green accent
            secondary: "#0A1A2F",
          },
        },
        error: {
          iconTheme: {
            primary: "#F87171", // Red accent
            secondary: "#0A1A2F",
          },
        },
      }}
    />
  );
}