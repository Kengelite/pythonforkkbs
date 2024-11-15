import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider, Helmet } from "react-helmet-async";
import AOS from "aos";
import "aos/dist/aos.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./components/css/footer.css";
import Navbar from "./components/navbar/navbar.jsx";
import { Contentmain } from "./components/main/content.jsx";
import Footerdiv from "./components/footer/footer.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./components/css/main.css";
import { ExercisesPage } from "./components/main/exercises.jsx";
import ScoreallPage from "./components/main/scoreall.jsx";
import { Contentmain_chapter } from "./components/main/chapter.jsx";
import { Contentmain_chapter_to_lesson } from "./components/main/chapter_lesson.jsx";
import { ProfilePage } from "./components/main/profile.jsx";
import { Page_select_exercises } from "./components/main/select_exercises.jsx";
import { Send_ExercisesPage } from "./components/main/send-execises.jsx";
import { Page_select_leeson } from "./components/main/lesson.jsx";
import { ViewLessonPage } from "./components/main/view_lesson.jsx";

import LoginPage from "./components/main/login.jsx";

const LayoutWithFooter = ({ children }) => (
  <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
    <Navbar />
    <main className="flex-grow-1 container my-4">{children}</main>
    <Footerdiv />
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>บทเรียน</title>
        </Helmet>
        <Contentmain_chapter_to_lesson />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Exercises/:id",
    element: (
      <LayoutWithFooter>
        <ExercisesPage />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Chapter",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>บท</title>
        </Helmet>
        <Contentmain_chapter />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Lesson",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>บทเรียน</title>
        </Helmet>
        <Contentmain_chapter_to_lesson />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Lesson/:id",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>บทเรียน</title>
        </Helmet>
        <Page_select_leeson />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Lesson/:id_chapter/:id",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>เนื้อหา</title>
        </Helmet>
        <ViewLessonPage />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/Chapter/exercises/:id",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>แบบฝึกหัด</title>
        </Helmet>
        <Page_select_exercises />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/send-exercises/:id",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>ผลลัพธ์</title>
        </Helmet>
        <Send_ExercisesPage />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/login",
    element: (
      <LayoutWithFooter>
        <Helmet>
          <title>เข้าสู่ระบบ</title>
        </Helmet>
        <LoginPage />
      </LayoutWithFooter>
    ),
  },
  {
    path: "/profile",
    element: (
      <LayoutWithFooter>
        <ProfilePage />
      </LayoutWithFooter>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </React.StrictMode>
);
