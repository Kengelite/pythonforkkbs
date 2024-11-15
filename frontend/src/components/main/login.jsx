import { setCookie,getCookie } from "../callapi/callcookie";
function LoginPage() {
  // เซ็ต Cookie ชื่อ "userSession" ที่มีค่าเป็น "12345" และหมดอายุใน 1 วัน

  const handleLogin = () => {
    // ข้อมูล Cookie
    setCookie("userSession", "12345", 1);
    // ทำการ Redirect หรือแสดงข้อความเมื่อเข้าสู่ระบบเรียบร้อยแล้ว
    alert("เข้าสู่ระบบสำเร็จ!"); // หรือใช้การ Redirect ไปหน้าอื่น
    console.log(document.cookie);
  };

  return (
    <>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <div className="d-flex justify-content-center ">
                        <img
                          src="https://computing.kku.ac.th/_nuxt/img/logo.7922285.png"
                          width="200"
                          alt="Logo"
                        />
                      </div>
                    </div>

                    <div className="row g-3 mt-5 needs-validation">
                      <div className="col-12">
                        <label htmlFor="yourUsername" className="form-label">
                          Username
                        </label>
                        <div className="input-group has-validation">
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            id="yourUsername"
                            required
                          />
                          <div className="invalid-feedback">
                            กรุณาป้อนข้อมูล username.
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label htmlFor="yourPassword" className="form-label">
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          id="yourPassword"
                          required
                        />
                        <div className="invalid-feedback">
                          กรุณาป้อนข้อมูล password!
                        </div>
                      </div>

                      <div className="col-12 mt-5">
                        <button
                          className="btn btn-primary w-100"
                          type="button" // เปลี่ยนจาก submit เป็น button
                          onClick={handleLogin} // เพิ่มฟังก์ชัน handleLogin
                        >
                          เข้าสู่ระบบ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="credits">
                  Designed by{" "}
                  <a href="https://www.facebook.com/keng.kak.313">
                    Apipath Kamput
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <a
        href="#"
        className="back-to-top d-flex align-items-center justify-content-center"
      >
        <i className="bi bi-arrow-up-short"></i>
      </a>
    </>
  );
}

export default LoginPage;
