import { React, useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import "../css/send-exe.css"
import Monaco from "@monaco-editor/react";
import { useParams } from "react-router-dom";
// import { runCodeAPI, handleSendInput } from "../callapi/callruncode";
import {
  fetchdata_chapter_execrises_work,
  sendScoreAPI,
  runCodeAPI
} from "../callapi/callruncode";
export function Send_ExercisesPage() {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [outputLog, setOutputLog] = useState([]); // เก็บ log ของ input และ output
  const [error, setError] = useState("");
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [userInputs, setUserInputs] = useState([]); // เก็บรายการ input ทั้งหมด
  const [currentInput, setCurrentInput] = useState(""); // เก็บ input ปัจจุบัน
  const [inputPrompt, setInputPrompt] = useState(""); // เริ่มต้นเป็นค่าว่าง
  const [ddivContent, setDdivContent] = useState([]); // เก็บข้อมูลใน ddiv

  const editorRef = useRef(null); // สร้าง ref สำหรับเก็บ instance ของ Monaco Editor
  const [exercisesData, setexercisesData] = useState([]);
  const [id_exeData, setid_exeDataData] = useState([]);
  const [scoreData, setscoreDataData] = useState([]);
  const [averageScore, setaverageScore] = useState();
  const [question, setQuestion] = useState("");
  function calculateAverageScore(data) {
    if (data.length === 0) return 0; // กรณีที่ array ว่างให้คืนค่าเป็น 0

    const totalScore = data.reduce((sum, item) => sum + item.score, 0); // รวมคะแนนทั้งหมด
    const averageScore = totalScore / data.length; // คำนวณค่าเฉลี่ย
    return averageScore;
  }
  useEffect(() => {
    AOS.init();
    const fetchexercisesData = async () => {
      try {
        const res_data = await fetchdata_chapter_execrises_work(id); // รอผลลัพธ์จาก API
        console.log(res_data.data); // แสดงข้อมูลที่ดึงมา
        setexercisesData(res_data.data); // เก็บข้อมูลที่ดึงมาใน state
        console.log(res_data.data[0].question);
        setQuestion(res_data.data[0].question);
        setid_exeDataData(res_data.data[0].exe_id);
        if (res_data.data[0].code != "") {
          setCode(res_data.data[0].code);
        }
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    fetchexercisesData(); // เรียกใช้ฟังก์ชัน
  }, []);

  const handleRunCode = () => {
    // รีเซ็ตข้อมูลก่อนที่จะรันโค้ดใหม่
    setOutputLog([]); // Clear previous output log
    setUserInputs([]); // Clear previous inputs
    setDdivContent([]); // Clear ddiv content
    setError(""); // Clear any previous errors

    if (code !== "") {
      // ตรวจสอบว่าโค้ดมีการเรียกใช้ `print` หรือไม่
      if (code.includes("print")) {
        Swal.fire({
          title: "กำลังรันโค้ด...",
          text: "โปรดรอซักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        runCodeAPI(code, id_exeData, id, (data) => {
          Swal.close(); // ปิด popup เมื่อได้รับผลลัพธ์จาก API

          const avgScore = calculateAverageScore(data); // คำนวณค่าเฉลี่ย
          setaverageScore(avgScore); // ใช้ setaverageScore เพื่ออัปเดตค่า
          console.log("Data received from API:", data); // Log data ที่ได้รับจาก runCodeAPI
          setscoreDataData(data);
        });
      } else {
        Swal.fire({
          icon: "warning",
          title: "โครงสร้างไม่มีคำสั่งแสดงผล",
          text: "โปรดเพิ่มคำสั่ง print ในโค้ดเพื่อแสดงผลลัพธ์",
        });
      }
    } else {
      Swal.fire({
        icon: "warning",
        title: "กรุณาใส่โค้ด",
        text: "โปรดกรอกโค้ดที่ต้องการรันก่อนดำเนินการ",
      });
    }
  };

  const handleSubmitScore = () => {
    Swal.fire({
      icon: "question",
      title: "คุณต้องการส่งคะแนนใช่หรือใหม่ ?",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ยืนยัน",
      customClass: {
        confirmButton: "btn btn-success", // ใช้คลาส Bootstrap btn-success
        cancelButton: "btn btn-danger",
      },
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        Swal.fire({
          title: "กำลังส่งคำตอบ...",
          text: "โปรดรอซักครู่",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        sendScoreAPI(code, id, averageScore, (data) => {
          console.log(code, id, averageScore);
          Swal.close(); // ปิด popup เมื่อได้รับผลลัพธ์จาก API

          if (data.success == true) {
            Swal.fire({
              icon: "success",
              title: "ส่งคะแนนเรียบร้อย",
              text: `คะแนนที่คุณได้ คือ ${averageScore}`, // ใช้ backticks เพื่อแทรกตัวแปร
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: "กรุณาลองใหม่อีกครั้ง",
            });
          }
        });
      }
    });
  };

  console.log(scoreData);
  return (
    <div className="container my-exercise-page mt-5 ">
      <div className="exercise-container">
        <h1 className="exercise-title">โจทย์</h1>
        <p className="exercise-content">{question}</p>
      </div>
      <div className="row mt-5">
        <div className="col-lg-7 code-editor-section mb-5 me-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3>Code</h3>
            <button
              onClick={handleRunCode}
              className="btn btn-success run-button"
            >
              ตรวจคำตอบ
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
              fontSize: 18, // กำหนดขนาดตัวอักษรเป็น 16px สามารถปรับได้ตามต้องการ
            }}
            editorDidMount={(editor) => {
              editorRef.current = editor; // เก็บ instance ของ editor
            }}
          />
        </div>

        <div className="col-lg-4 output-section ">
          <h2 className="">ผลลัพธ์ที่ต้องการ </h2>

          <table className="table mt-4 table-bordered outer-rounded-table">
            <thead>
              <tr>
                <th scope="col">ข้อ</th>
                <th scope="col" className="ps-3">
                  Input
                </th>
                <th scope="col" className="ps-3">
                  Ouput
                </th>
              </tr>
            </thead>
            <tbody>
              {exercisesData.length > 0 ? (
                exercisesData.map((todo, index) => {
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td
                        style={{
                          whiteSpace: "pre-wrap", // จัดการขึ้นบรรทัดใหม่โดยอัตโนมัติเมื่อพบ \n
                          overflow: "hidden", // ซ่อนข้อความที่เกินออกไป
                          textOverflow: "ellipsis", // แสดง "..." เมื่อข้อความยาวเกิน
                          maxWidth: "200px", // กำหนดขนาดสูงสุดของ td ที่ข้อความจะต้องอยู่ภายใน
                        }}
                      >
                        {todo.ans_input && todo.ans_input.includes("\n") ? (
                          todo.ans_input.split("\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              <br />
                            </span>
                          ))
                        ) : (
                          <span>{todo.ans_input || ""}</span> // ถ้าไม่มี ans_input ให้แสดงเป็น ""
                        )}
                      </td>
                      <td
                        style={{
                          whiteSpace: "pre-wrap", // จัดการขึ้นบรรทัดใหม่โดยอัตโนมัติเมื่อพบ \n
                          overflow: "hidden", // ซ่อนข้อความที่เกินออกไป
                          textOverflow: "ellipsis", // แสดง "..." เมื่อข้อความยาวเกิน
                          maxWidth: "200px", // กำหนดขนาดสูงสุดของ td ที่ข้อความจะต้องอยู่ภายใน
                        }}
                      >
                        {todo.ans_output.split("\n").map((line, index) => (
                          <span key={index}>
                            {line}
                            <br />
                          </span>
                        ))}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">กำลังโหลด...</span>
                    </div>
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr className="mt-5" />
          {averageScore != null ? (
            <>
              {/* <h3 className="mt-3">คะแนน</h3> */}
              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="fs-4"> <b>คะแนนที่ได้ : {averageScore}</b></div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSubmitScore} // Corrected to use `onClick` in React
                >
                  ส่งคะแนน
                </button>
              </div>
            </>
          ) : (
            <div>ยังไม่มีคะแนน</div>
          )}
          {scoreData.length != 0 ? (
            <div style={{ overflowX: "auto", maxWidth: "100%" }}>
              <table
                className="table mt-4 table-bordered outer-rounded-table"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th scope="col">ข้อ</th>
                    <th scope="col" className="ps-3">
                      Ouput
                    </th>
                    <th scope="col" className="ps-3">
                      Score
                    </th>
                    <th scope="col" className="ps-3">
                      หมายเหตุ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {scoreData.length > 0 ? (
                    scoreData.map((todo, index) => {
                      return (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td
                            style={{
                              whiteSpace: "pre-wrap", // จัดการขึ้นบรรทัดใหม่โดยอัตโนมัติเมื่อพบ \n
                              overflow: "hidden", // ซ่อนข้อความที่เกินออกไป
                              textOverflow: "ellipsis", // แสดง "..." เมื่อข้อความยาวเกิน
                              maxWidth: "200px", // กำหนดขนาดสูงสุดของ td ที่ข้อความจะต้องอยู่ภายใน
                            }}
                          >
                            {todo.output.split("\n").map((line, index) => (
                              <span key={index}>
                                {line}
                                <br />
                              </span>
                            ))}
                          </td>
                          <td
                            style={{
                              whiteSpace: "pre-wrap", // จัดการขึ้นบรรทัดใหม่โดยอัตโนมัติเมื่อพบ \n
                              overflow: "hidden", // ซ่อนข้อความที่เกินออกไป
                              textOverflow: "ellipsis", // แสดง "..." เมื่อข้อความยาวเกิน
                              maxWidth: "200px", // กำหนดขนาดสูงสุดของ td ที่ข้อความจะต้องอยู่ภายใน
                            }}
                          >
                            {todo.score}
                          </td>
                          <td
                            style={{
                              whiteSpace: "pre-wrap", // แสดงข้อความแบบขึ้นบรรทัดใหม่ตามต้นฉบับ
                              wordBreak: "break-word", // ตัดคำอัตโนมัติถ้าล้น
                              maxWidth: "200px", // กำหนดขนาดสูงสุดให้ td เพื่อควบคุมความกว้าง
                            }}
                          >
                            {/* แสดงผลข้อความ */}
                            {todo.error}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">กำลังโหลด...</span>
                        </div>
                        กำลังโหลดข้อมูล...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
