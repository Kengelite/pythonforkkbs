

export function ProfilePage() {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8 col-sm-12">
          <div className="card">
            <div className="card-header text-center bg-primary text-white">
              <h4>โปรไฟล์ของคุณ</h4>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-center mb-4">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="rounded-circle"
                  width="150"
                  height="150"
                />
              </div>
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    placeholder="กรอกชื่อผู้ใช้"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="กรอกรหัสผ่าน"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    บันทึกข้อมูล
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// export default ProfilePage;