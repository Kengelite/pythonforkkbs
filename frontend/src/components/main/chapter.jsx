import logoimage from "../images/logo.jpg";
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link } from "react-router-dom";
import { fetchdata_chapter } from "../callapi/callruncode";

export function Contentmain_chapter() {
  const [chapterData, setChapterData] = useState([]); // สร้าง state เพื่อเก็บข้อมูลที่ดึงมา

  useEffect(() => {
    // สร้างฟังก์ชัน async ภายใน useEffect
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
  }, []); // ใส่ dependency array เป็น [] เพื่อให้ทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  return (
    <>
      <h2 className="mt-5">แบบฝึกหัดชุดที่ 1</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อ</th>
            <th scope="col" className="ps-5">คะแนน</th>
            <th scope="col" className="ps-3">สถานะ</th>
            <th scope="col"></th>
            {/* <th scope="col"></th> */}
          </tr>
        </thead>
        <tbody>
          {chapterData.length > 0 ? (
            chapterData.map((todo, index) => {
              return (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{todo.name}</td>
                  <td>
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
                  </td>
                  <td className="ps-5">
                    {todo.status_now === true ? (
                      <i className="bi bi-check-circle-fill bi-check-success"></i>
                    ) : (
                      <i className="bi bi-x-circle-fill bi-check-block"></i>
                    )}
                  </td>
                  <td>
                    <Link to={`/Chapter/exercises/${todo.chapter_id}`}>
                      <button className="btn btn-warning">ทำแบบฝึกหัด</button>
                    </Link>
                  </td>
                  {/* <td>
                    <Link to={`/send-exercises/${todo.id_chapter}`} className="ps-5">
                      <button className="btn btn-warning">ทำแบบฝึกหัด</button>
                    </Link>
                  </td> */}
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