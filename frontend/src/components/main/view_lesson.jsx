import { React, useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "../css/send-exe.css";
import Monaco from "@monaco-editor/react";
import {
  fetchdata_chapter_lesson,
  runCode_simpleAPI,
} from "../callapi/callruncode";
import Swal from "sweetalert2";

export function ViewLessonPage() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [exercisesData, setExercisesData] = useState([]);
  const [outputData, setOutputData] = useState([]); // เก็บ output แยกต่างหาก
  const [errorData, setErrorData] = useState([]); // เก็บ error ของแต่ละข้อ
  const editorRef = useRef(null);

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        const res_data = await fetchdata_chapter_lesson(id);
        console.log(res_data.data);
        setExercisesData(res_data.data);
        setCode(res_data.data[0]?.code || ""); // ตั้งค่าโค้ดเริ่มต้น
        setOutputData(new Array(res_data.data.length).fill("")); // สร้าง array เปล่าสำหรับ output แต่ละข้อ
        setErrorData(new Array(res_data.data.length).fill("")); // สร้าง array เปล่าสำหรับ error แต่ละข้อ
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };
    fetchExercisesData();
  }, [id]);

  const handleRunCodeAll = async () => {
    if (code.trim() === "") {
      Swal.fire({
        icon: "warning",
        title: "กรุณาใส่โค้ด",
        text: "โปรดกรอกโค้ดที่ต้องการรันก่อนดำเนินการ",
      });
      return;
    }

    try {
      Swal.fire({
        title: "กำลังรันโค้ด...",
        text: "โปรดรอซักครู่",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // รันโค้ดทั้งหมดในแต่ละข้อ
      const allResults = await Promise.all(
        exercisesData.map((todo) => {
          const input = todo.input_code?.split("\n") || []; // ดึง input ของแต่ละข้อ
          return runCode_simpleAPI(code, input); // ส่งโค้ดและ input ไปยัง API
        })
      );

      Swal.close();

      // อัปเดต outputData และ errorData
      const updatedOutputs = allResults.map((result) => result.output || "-");
      const updatedErrors = allResults.map((result) => result.error || ""); // เก็บ error ของแต่ละข้อ
      setOutputData(updatedOutputs);
      setErrorData(updatedErrors);

      Swal.fire({
        icon: "success",
        title: "รันโค้ดสำเร็จ",
        text: "ผลลัพธ์ได้อัปเดตเรียบร้อยแล้ว",
      });
    } catch (error) {
      Swal.close();
      console.error("Error running code:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถรันโค้ดได้",
      });
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          {exercisesData.length > 0 ? (
            exercisesData.map((todo, index) => (
              <div className="container my-exercise-page mt-5" key={index}>
                <div className="exercise-container">
                  <h1 className="exercise-title ">{todo.name}</h1>
                  <p className="exercise-content" style={{ fontSize: "18px" }}>
                    {todo.txt}
                  </p>
                  {todo.url_image ? (
                    <img
                      src={`${todo.url_image}`}
                      alt="Exercise Image"
                      onError={(e) => (e.target.style.display = "none")}
                      style={{
                        maxWidth: "20rem",
                        height: "auto",
                        marginTop: "20px",
                      }}
                    />
                  ) : (
                    <p>ไม่มีรูปภาพ</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div>ไม่มีข้อมูล</div>
          )}
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8 col-sm-12 ms-2">
          <div className="col-lg-12 code-editor-section mb-5 me-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>Code</h3>
              <button
                onClick={handleRunCodeAll} // เรียกฟังก์ชันสำหรับรันทั้งหมด
                className="btn btn-success run-button"
              >
                Run
              </button>
            </div>
            <Monaco
              height="400px"
              language="python"
              value={code}
              onChange={(value) => setCode(value || "")}
              theme="vs-dark"
              className="monaco-editor"
              options={{
                fontSize: 24,
              }}
              editorDidMount={(editor) => {
                editorRef.current = editor;
              }}
            />
          </div>
        </div>
        <div className="col-lg-3">
          <h2 className="">ผลลัพธ์ </h2>
          <table className="table mt-4 table-bordered outer-rounded-table">
            <thead>
              <tr>
                <th scope="col">ข้อ</th>
                <th scope="col" className="ps-3">
                  Input
                </th>
                <th scope="col" className="ps-3">
                  Output
                </th>
              </tr>
            </thead>
            <tbody>
              {exercisesData.length > 0 ? (
                exercisesData.map((todo, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td style={{ whiteSpace: "pre-wrap", maxWidth: "200px" }}>
                      {todo.input_code ? (
                        todo.input_code.split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td style={{ whiteSpace: "pre-wrap", maxWidth: "200px" }}>
                      {outputData[index] ? (
                        outputData[index].split("\n").map((line, idx) => (
                          <span key={idx}>
                            {line}
                            <br />
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                      {/* แสดง error ถ้ามี */}
                      {errorData[index] && (
                        <p style={{ color: "red" }}>{errorData[index]}</p>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">กำลังโหลด...</span>
                    </div>
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
