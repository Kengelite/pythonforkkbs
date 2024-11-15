
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link } from "react-router-dom";
import { fetchdata_chapter } from "../callapi/callruncode";
import { setCookie,getCookie } from "../callapi/callcookie";
export function Contentmain_chapter_to_lesson() {
  const [chapterData, setChapterData] = useState([]); // สร้าง state เพื่อเก็บข้อมูลที่ดึงมา

  useEffect(() => {
    // สร้างฟังก์ชัน async ภายใน useEffect
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
  }, []); // ใส่ dependency array เป็น [] เพื่อให้ทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  return (
    <>
      <h2 className="mt-5">เนื้อหาและบทเรียน</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อ</th>
            {/* <th scope="col" >คะแนน</th>
            <th scope="col" className="ps-3">สถานะ</th> */}
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
                    <Link to={`/Lesson/${todo.chapter_id}`}>
                      <button className="btn btn-warning">เนื้อหา</button>
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