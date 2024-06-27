import { React, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "../css/content.css";
import { useParams } from "react-router-dom";

export function ExercisesPage() {
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [scoreall, setscoreall] = useState(0);
  const runScoreTest = () => {
    setProgress(90);
    setscoreall(360 / 4);
  };

  return (
    <>
      <div className="row mt-5">
        <div className="col-lg-6">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="mb-0">{id} </h2>

            <h2 className="mb-0 text-end text-success">{scoreall} %</h2>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. A voluptas
            ut amet ab facilis quod, mollitia delectus earum laudantium illo et
            reiciendis error obcaecati cumque unde dolorum porro ea nemo.
          </p>

          <div className="row">
            <div className="col-12">
              <h4 className="mb-2">test 1 </h4>
              <label for="pythonCode" className="form-label mb-0">
                Output
              </label>
              <input type="text" readOnly className="form-control" />
              <div
                className="progress"
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  style={{ width: `${progress}%` }}
                >
                  {progress} %
                </div>
              </div>
            </div>

            <div className="col-12 mt-5">
              <h4>test 2</h4>
              <label for="pythonCode" className="form-label mb-0">
                Output
              </label>
              <input type="text" readOnly className="form-control" />
              <div
                className="progress "
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated "
                  style={{ width: `${progress}%` }}
                >
                  {progress} %
                </div>
              </div>
            </div>

            <div className="col-12 mt-5">
              <h4>test 3</h4>
              <label for="pythonCode" className="form-label mb-0">
                Output
              </label>
              <input type="text" readOnly className="form-control" />
              <div
                className="progress "
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="0"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated "
                  style={{ width: `${progress}%` }}
                >
                  {progress} %
                </div>
              </div>
            </div>

            <div className="col-12 mt-5">
              <h4>test 4</h4>
              <label for="pythonCode" className="form-label mb-0">
                Output
              </label>
              <input type="text" readOnly className="form-control" />
              <div
                className="progress "
                role="progressbar"
                aria-label="Animated striped example"
                aria-valuenow="90"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated "
                  style={{ width: `${progress}%` }}
                >
                  {progress} %
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6 mt-5">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label htmlFor="pythonCode" className="form-label mb-0">
              Python Code
            </label>
            <div className="ms-auto">
              <button className="btn btn-success me-2" onClick={runScoreTest}>
                ส่งตรวจสอบคำตอบ
              </button>
              <button className="btn btn-success" onClick={runScoreTest}>
                รัน Code
              </button>
            </div>
          </div>
          <textarea
            id="pythonCode"
            className="form-control"
            rows="30"
            placeholder="เขียน Code ได้ตรงนี้ ..."
          ></textarea>
        </div>

        <div className="row mt-5">
          <h2> ผลลัพธ์</h2>
          <textarea
            id="pythonCode"
            className="form-control"
            rows="10"
            placeholder=""
            readOnly
          ></textarea>
        </div>
      </div>
    </>
  );
}
