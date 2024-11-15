
function Footerdiv() {
  return (
    <>
      <div className="footer bg-dark text-light">
        <div className="container">
          <div className="row pt-3">
            <div className="col-lg-12 mt-3 mb-4 text-center">
              <img
                src="https://computing.kku.ac.th/_nuxt/img/logo2.06d1225.png"
                width="100"
                alt="KKU Logo"
                className="img-fluid"
              />
              <span className="ms-5 text-white">
                © Copyright by{" "}
                <a
                  href="https://www.facebook.com/keng.kak.313"
                  style={{ color: "white", textDecoration: "none" }}
                  onMouseOver={(e) => (e.target.style.color = "#0d6efd")}
                  onMouseOut={(e) => (e.target.style.color = "white")}
                >
                  Apipath Kamput
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footerdiv;
