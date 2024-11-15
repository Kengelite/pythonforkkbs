import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link } from "react-router-dom";
import { fetchdata_chapter } from "../callapi/callruncode";
import { setCookie, getCookie } from "../callapi/callcookie";

export function Contentmain_chapter() {
  const [chapterData, setChapterData] = useState([]); // สร้าง state เพื่อเก็บข้อมูลที่ดึงมา

  useEffect(() => {
    const userSession = getCookie("userSession");
    console.log("userSession:", userSession);
    const fetchChapterData = async () => {
      try {
        const res_data = await fetchdata_chapter(); // รอผลลัพธ์จาก API
        console.log(res_data.data); // แสดงข้อมูลที่ดึงมา
        setChapterData(res_data.data); // เก็บข้อมูลที่ดึงมาใน state
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    fetchChapterData(); // เรียกใช้ฟังก์ชัน
  }, []);

  const calculateRemainingDays = (startDate, endDate) => {
    const today = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start && today < start) {
      return "ยังไม่เปิด"; // ยังไม่เริ่ม
    }
    if (end && today > end) {
      return "สิ้นสุดเวลาทำแลป"; // หมดเวลาทำแบบฝึกหัดแล้ว
    }

    const diffTime = end ? end - today : 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // คำนวณต่างวันเป็นจำนวนเต็ม
    return diffDays > 0 ? `${diffDays} วัน` : "วันนี้เป็นวันสุดท้าย"; // กรณีที่เหลือเวลา 0 วัน
  };

  const isExerciseAvailable = (startDate, endDate) => {
    const today = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    return start && today >= start && (!end || today <= end); // ตรวจสอบว่าปัจจุบันอยู่ในช่วงเวลา
  };

  return (
    <>
      <h2 className="mt-5">แบบฝึกหัดชุดที่ 1</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อ</th>
            <th scope="col" className="pe-5">
              คะแนน
            </th>
            <th scope="col">คงเหลือ</th>
            <th scope="col" className="ps-5"></th>
          </tr>
        </thead>
        <tbody>
          {chapterData.length > 0 ? (
            chapterData.map((todo, index) => {
              const remainingDays = calculateRemainingDays(
                todo.assigned_start,
                todo.assigned_end
              ); // คำนวณวันคงเหลือ
              const isAvailable = isExerciseAvailable(
                todo.assigned_start,
                todo.assigned_end
              ); // ตรวจสอบว่าปุ่มควรแสดงหรือไม่

              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{todo.name}</td>
                  <td className="pe-5">
                    {remainingDays !== "ยังไม่เปิด" ? (
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuenow={todo.avg_score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${todo.avg_score}%` }}
                        >
                          {todo.avg_score} %
                        </div>
                      </div>
                    ) : (
                      <span>-</span> // หรือข้อความอื่นๆ เช่น "ยังไม่เปิด"
                    )}
                  </td>
                  <td>{remainingDays}</td>
                  <td className="ps-5">
                    {isAvailable && (
                      <Link to={`/Chapter/exercises/${todo.chapter_id}`}>
                        <button className="btn btn-warning">ทำแบบฝึกหัด</button>
                      </Link>
                    )}
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
    </>
  );
}
