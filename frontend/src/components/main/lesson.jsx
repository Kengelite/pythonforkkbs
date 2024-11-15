
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link, useParams } from "react-router-dom";
import { fetchdata_chapter_lesson } from "../callapi/callruncode";


export function Page_select_leeson() {
  const [exercisesData, setexercisesData] = useState([]); // สร้าง state เพื่อเก็บข้อมูลที่ดึงมา
  const { id } = useParams();
  console.log(id);
  useEffect(() => {
    // สร้างฟังก์ชัน async ภายใน useEffect
    const fetchexercisesData = async () => {
      try {
        const res_data = await fetchdata_chapter_lesson(id); // รอผลลัพธ์จาก API
        console.log(res_data.data); // แสดงข้อมูลที่ดึงมา
        setexercisesData(res_data.data); // เก็บข้อมูลที่ดึงมาใน state
      } catch (error) {
        console.error("Error fetching chapter data:", error);
      }
    };

    fetchexercisesData(); // เรียกใช้ฟังก์ชัน
  }, [id]); // ใส่ dependency array เป็น [] เพื่อให้ทำงานแค่ครั้งเดียวเมื่อ component ถูก mount

  return (
    <>
      <h2 className="mt-5">เนื้อหาบทที่ {id}</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ</th>
            <th scope="col">ชื่อ</th>
            <th scope="col"></th>
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
                    {todo.name}
                  </td>
                  <td>
                    <Link to={`/Lesson/${id}/${todo.id}`} className="ps-5">
                      <button className="btn btn-primary">ดูเนื้อหา</button>
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
