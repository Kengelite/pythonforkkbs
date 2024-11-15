
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link, useParams } from "react-router-dom";
import { fetchdata_chapter_execrises } from "../callapi/callruncode";

export function Page_select_exercises() {
  const [exercisesData, setexercisesData] = useState([]); // สร้าง state เพื่อเก็บข้อมูลที่ดึงมา
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    // สร้างฟังก์ชัน async ภายใน useEffect
    const fetchexercisesData = async () => {
      try {
        const res_data = await fetchdata_chapter_execrises(id); // รอผลลัพธ์จาก API
        console.log(res_data.data); // แสดงข้อมูลที่ดึงมา
        setexercisesData(res_data.data); // เก็บข้อมูลที่ดึงมาใน state
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    fetchexercisesData(); // เรียกใช้ฟังก์ชัน
  }, []); // ใส่ dependency array เป็น [] เพื่อให้ทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  return (
    <>
      <h2 className="mt-5">แบบฝึกหัดชุดที่  {id}</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อ</th>
            <th scope="col" className="ps-5">คะแนน</th>

            {/* <th scope="col"></th> */}
            <th scope="col" className="ps-5"></th>
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
                      whiteSpace: "nowrap", // ไม่ให้ข้อความตัดบรรทัด
                      overflow: "hidden", // ซ่อนข้อความที่เกินออกไป
                      textOverflow: "ellipsis", // แสดง "..." เมื่อข้อความยาวเกิน
                      maxWidth: "200px", // กำหนดขนาดสูงสุดของ td ที่ข้อความจะต้องอยู่ภายใน
                    }}
                  >
                    {todo.question}
                  </td>
                  <td className="ps-5">
                    {todo.score != 0 ? (
                      <div
                        className="progress"
                        role="progressbar"
                        aria-label="Animated striped example"
                        aria-valuenow={todo.score}
                        aria-valuemin="0"
                        aria-valuemax="100"
                        style={{ height: "20px" }} // เพิ่มความสูงให้ progress bar
                      >
                        <div
                          className="progress-bar progress-bar-striped progress-bar-animated"
                          style={{ width: `${todo.score}%`, height: "20px" }} // เพิ่มความสูงของ progress bar
                        >
                          <span className="m-2">{todo.score} %</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        style={{
                          fontSize: "2rem",
                          height: "40px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {" "}
                        {/* ปรับการจัดตำแหน่งเมื่อ score เป็น 0 */}
                      </div>
                    )}
                  </td>
                
                  {/* <td>
                    <Link to={`/Exercises/${todo.id_chapter}`}>
                      <button className="btn btn-warning">ทำแบบฝึกหัด</button>
                    </Link>
                  </td> */}
                  <td className="ps-5">
                    <Link to={`/send-exercises/${todo.user_exe_id}`} className="ps-5">
                      <button className="btn btn-primary">ทำแบบฝึกหัด</button>
                    </Link>
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
