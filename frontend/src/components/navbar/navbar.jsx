import React from "react";
import logoimage from "../images/logo.png";
import { Link, useLocation } from "react-router-dom";
import "../css/nav.css";

function Navbar() {
  const location = useLocation();

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container"> {/* ใช้ container ปกติ */}
          <div className="d-flex align-items-center">
            <a className="navbar-brand d-flex align-items-center" href="/">
              <img src={logoimage} alt="Logo" style={{ width: "150px" }} />{" "}
            </a>
            <h3 className="ms-2">CP020001 Python</h3>
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-2 mb-2 mb-lg-0">
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/Lesson") ? "active" : ""
                  }`}
                  to="/Lesson"
                >
                  บทเรียน
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/Chapter") ? "active" : ""
                  }`}
                  to="/Chapter"
                >
                  แบบฝึกหัด
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${
                    location.pathname.startsWith("/profile") ? "active" : ""
                  }`}
                  to="/profile"
                >
                  โปรไฟล์
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;