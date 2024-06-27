import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import AOS from "aos";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from './App.jsx'
// import './index.css'
import Navbar from "./components/navbar/navbar.jsx";
import { Contentmain } from "./components/main/content.jsx";
import Footerdiv from "./components/footer/footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { ExercisesPage } from "./components/main/exercises.jsx";
import ScoreallPage from "./components/main/scoreall.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="container">
        <Navbar />
        <Contentmain />
        {/* <Footerdiv /> */}
      </div>
    ),
  },
  {
    path: "/Exercises/:id",
    element: (
      <div className="container">
        <Navbar />
        <ExercisesPage />
        {/* <Footerdiv /> */}
      </div>
    ),
  },
  {
    path: "/scoreall",
    element: (
      <div className="container">
        <Navbar />
        <ScoreallPage />
        {/* <Footerdiv /> */}
      </div>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
      <RouterProvider router={router} />
    <Footerdiv />
  </React.StrictMode>
);
