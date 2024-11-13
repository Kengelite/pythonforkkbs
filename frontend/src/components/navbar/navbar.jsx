import logoimage from "../images/logo.jpg";
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <>
      <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">
            <img src={logoimage} alt="" width="60rem" />
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse  navbar-collapse" id="navbarSupportedContent">
            <form class="d-flex ms-auto" role="search">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button class="btn btn-outline-success" type="submit">
                ค้นหา
              </button>
            </form>

            <ul class="navbar-nav  mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">
                  บทเรียน
                </a>
              </li>
              <li class="nav-item">
              
                  <a class="nav-link" href="/scoreall">สรุปคะแนนรายบท</a>
      
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">
                  คะแนนทั้งหมด
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
