import { React, useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Monaco from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import { runCodeAPI, handleSendInput } from "../callapi/callruncode";

export function ExercisesPage() {
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

  useEffect(() => {
    AOS.init();
  }, []);

  const handleRunCode = () => {
    // รีเซ็ตข้อมูลก่อนที่จะรันโค้ดใหม่
    setOutputLog([]); // Clear previous output log
    setUserInputs([]); // Clear previous inputs
    setDdivContent([]); // Clear ddiv content
    setError(""); // Clear any previous errors
    
    runCodeAPI(code, (data) => {
      if (data.status === "wait") {
        setWaitingForInput(true);
        // เพิ่ม output ลงใน ddivContent ก่อน
        setDdivContent(prevContent => [
          ...prevContent,
          { type: "output", message: data.output || "" }, // แสดง output ที่ได้รับจากการรัน
        ]);
        setInputPrompt(data.prompt || "กรุณาป้อนข้อมูล");
      } else {
        // เพิ่ม output ลงใน ddivContent
        setDdivContent(prevContent => [
          ...prevContent,
          { type: "output", message: data.output || "" } // แสดง output ที่ได้รับจากการรัน
        ]);
        setError(data.error || "");
        setWaitingForInput(false);
      }
    });
  };

  // ฟังก์ชันสำหรับการจัดการการป้อนข้อมูลของผู้ใช้
  const handleUserInput = (userInput) => {
    if (currentInput.trim() === "") return; // ป้องกันการส่งข้อมูลว่าง

    setUserInputs(prevInputs => [
      ...prevInputs,
      { prompt: inputPrompt, value: userInput }
    ]);

    // ส่งข้อมูลผู้ใช้ไปยังเซิร์ฟเวอร์
    handleSendInput(userInput, inputPrompt, setCurrentInput, (data) => {
      if (data.status === "wait") {
        setWaitingForInput(true);
        setInputPrompt(data.prompt || "กรุณาป้อนข้อมูล");
      } else {
        // เพิ่ม input ของผู้ใช้และ output ลงใน ddivContent
        setDdivContent(prevContent => [
          ...prevContent,
          { type: "input", message: userInput }, // แสดง input ที่ผู้ใช้กรอก
          { type: "output", message: data.output || "" } // แสดง output ที่ได้รับ
        ]);
        setError(data.error || "");
        setWaitingForInput(false);
      }
    });
  };

  return (
    <div className="container my-exercise-page">
      <h2 className="exercise-title">{id}</h2>
      <div className="row">
        <div className="col-lg-6 code-editor-section">
          <Monaco
            height="400px"
            language="python"
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            className="monaco-editor"
            editorDidMount={(editor) => { editorRef.current = editor; }} // เก็บ instance ของ editor
          />
          <button
            onClick={handleRunCode}
            className="btn btn-primary mt-3 run-button"
          >
            รัน Code
          </button>
        </div>

        <div className="col-lg-6 output-section">
          <h3>ผลลัพธ์</h3>
          
          <div className="ddiv">
            {ddivContent.map((entry, index) => (
              <div key={index} className={`ddiv-entry ${entry.type}`}>
                <pre>{entry.message}</pre>
              </div>
            ))}
          </div>

          {/* แสดง input ที่กรอกไปแล้ว */}
          <div className="input-history mt-3">
            {userInputs.map((input, index) => (
              <div key={index} className="previous-input">
                <strong>{input.prompt}:</strong> {input.value}
              </div>
            ))}
          </div>

          {/* ฟิลด์ input และปุ่มส่งข้อมูล */}
          {waitingForInput && (
            <div className="input-section mt-3 d-flex align-items-center">
              <label className="form-label input-prompt me-2">
                {inputPrompt}
              </label>
              <input
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                className="form-control user-input me-2"
                placeholder="กรอกข้อมูลที่นี่"
              />
              <button
                onClick={() => handleUserInput(currentInput)}
                className="btn btn-secondary submit-input"
              >
                ส่งข้อมูล
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}