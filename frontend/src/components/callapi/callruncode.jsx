
import axios from 'axios'

let api = "http://localhost:5002";
export function runCodeAPI(code, id_exe, id,callback) {
  const apiUrl = `http://localhost:5002/run-python-test`;

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, id_exe ,id}), // ส่ง `code` และ `id_exe` ใน body
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received from API:", data); // Log ข้อมูลที่ได้รับจาก API
      callback(data); // ส่ง data ทั้งหมดกลับไปโดยตรง
    })
    .catch((err) => {
      console.error("Error running code:", err);
      callback([{ output: "", error: "Error calling API", score: 0 }]);
    });
}

export function sendScoreAPI(code, id, averageScore, callback) {
  const apiUrl = `${api}/send-send-score`;
  console.log("sdasdsad", code, id, averageScore); // ตรวจสอบค่าที่ส่ง

  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, id, averageScore }), // ส่งข้อมูลทั้งหมดใน body
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data received from API:", data); // Log ข้อมูลที่ได้รับจาก API
      callback(data); // ส่ง data ทั้งหมดกลับไปโดยตรง
    })
    .catch((err) => {
      console.error("Error running code:", err);
      callback({ error: "Error calling API", success: false });
    });
}

// src/utils/sendInput.js

// sendInputAPI.js
// ใน callruncode.jsx
export const handleSendInput = (userInput, inputPrompt, setCurrentInput, callback) => {
  // เรียก API หรือทำการประมวลผลอื่นๆ
  console.log(userInput)
  fetch("http://localhost:5002/send-input", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userInput }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // เรียก callback ที่ส่งผ่านมา
      callback(data);
    })
    .catch(err => {
      console.error("Error sending input:", err);
    });
};

export  async function fetchdata_chapter(){
  try{
    const response_data = await axios.get(`${api}/send-data-chapter`)
    // console.log(response_data)
    return response_data.data
  }catch(error){
    console.log("error : ", error);
  }
};


export async function fetchdata_chapter_execrises(id_chapter) {
  try {
    const id = "fcf470ca-9ee3-11ef-a194-4e0b845de94b"; // id ที่ต้องการส่ง
    const response_data = await axios.get(`${api}/send-data-exercises`, {
      params: { id_user: id , id_chapter:id_chapter }  // ส่ง `id_user` เป็น query parameter
    });
    // console.log(response_data)
    return response_data.data; // คืนค่าข้อมูลจาก API
  } catch (error) {
    console.log("error : ", error); // จัดการข้อผิดพลาด
  }
}


export async function fetchdata_chapter_execrises_work(selete_id_exe) {
  try {
    const id = "fcf470ca-9ee3-11ef-a194-4e0b845de94b"; // id ที่ต้องการส่ง
    const response_data = await axios.get(`${api}/send-work-exercises`, {
      params: { id_userExe: selete_id_exe }  // ส่ง `id_user` เป็น query parameter
    });
    // console.log(response_data)
    console.log(selete_id_exe)
    return response_data.data; // คืนค่าข้อมูลจาก API
  } catch (error) {
    console.log("error : ", error); // จัดการข้อผิดพลาด
  }
}