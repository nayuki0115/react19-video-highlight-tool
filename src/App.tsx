import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "@/router/Index";
import "@/index.css";

const App = () => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "mytheme");
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-base-100">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
