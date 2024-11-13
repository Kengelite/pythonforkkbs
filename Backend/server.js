const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { exec, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const app = express();
const port = 5002;
const levenshtein = require("fast-levenshtein"); // นำเข้าไลบรารี Levenshtein สำหรับคำนวณความคล้ายคลึงของข้อความ

app.use(cors());
app.use(bodyParser.json());
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "",
  database: "dbcpkkbs", // เปลี่ยนชื่อฐานข้อมูลตามที่คุณใช้งาน
};

// สร้างการเชื่อมต่อฐานข้อมูล MySQL
async function initializeDB() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("Database connected");
    return connection;
  } catch (err) {
    console.error("Error connecting to the database:", err);
  }
}

let inputQueue = []; // Queue สำหรับเก็บ input ของผู้ใช้
let waitingForInput = false;
let currentCode = ""; // เก็บโค้ด Python ที่ต้องการรัน
let lastPrompt = "";
app.post("/run-python", (req, res) => {
  inputQueue = []; // เริ่มต้น queue สำหรับเก็บข้อมูล input ของผู้ใช้
  currentCode = req.body.code; // เก็บโค้ด Python ที่รับมาจากไคลเอนต์

  // ตัวแปรสำหรับเก็บ input prompt และเลขบรรทัดของ input() ที่เจอ
  const inputPrompts = [];
  const arr_line = [];
  const inputRegex = /input\(["'](.*?)["']\)/g; // Regex สำหรับค้นหา input() ที่มีข้อความ prompt

  const codeLines = currentCode.split("\n"); // แยกโค้ดออกเป็นบรรทัด เพื่อให้ง่ายต่อการจัดการบรรทัดต่อบรรทัด

  // วนลูปแต่ละบรรทัดของโค้ดเพื่อค้นหาและเก็บ prompt ของ input และเลขบรรทัด
  codeLines.forEach((line, index) => {
    let match;
    while ((match = inputRegex.exec(line)) !== null) {
      inputPrompts.push(match[1]); // เก็บข้อความ prompt ของ input (เช่น "Enter a number:")
      arr_line.push(index + 1); // เก็บเลขบรรทัด (เริ่มที่ 1) ของ prompt
    }
  });

  if (inputPrompts.length > 0) {
    waitingForInput = true;

    // Generate the Python code to run until it reaches an input line in `arr_line`
    let codeTemplate = `
input_values = ${JSON.stringify(inputQueue)};
line_to_pause = ${JSON.stringify(arr_line)};

def input(prompt=""):
    if not input_values:
        raise IndexError("รอข้อมูลเพิ่ม")
    return input_values.pop(0)

paused = False
current_line = 1

# Simulate execution line by line and pause if reaching a line that requires input
for i, line in enumerate(${JSON.stringify(codeLines)}):
    if current_line in line_to_pause:
        paused = True
        break
    exec(line)
    current_line += 1

if not paused:
    print("Code executed without pausing for input.")
`;

    const filePath = path.join(__dirname, "temp.py");

    fs.writeFile(filePath, codeTemplate, (err) => {
      if (err) {
        return res.json({ output: "", error: "Error writing file" });
      }

      exec(`python3 ${filePath}`, (error, stdout, stderr) => {
        fs.unlink(filePath, () => {});

        if (inputPrompts.length > 0) {
          waitingForInput = true;
          res.json({
            waitingForInput: true,
            output: stdout,
            prompt: inputPrompts[inputQueue.length],
          });
        } else if (error) {
          res.json({ status: "error", output: "", error: stderr });
        } else {
          res.json({ status: "done", output: stdout, error: "" });
        }
      });
    });
  } else {
    // If no input prompts, run the entire code
    const codeTemplate = `
input_values = ${JSON.stringify(
      inputQueue
    )}  # กำหนดค่าเริ่มต้นสำหรับ input queue
def input():
    if not input_values:
        raise IndexError("รอข้อมูลเพิ่ม")  # ถ้าไม่มี input ใน queue ให้ส่งสัญญาณว่ารอข้อมูล
    return input_values.pop(0)  # ดึงค่าต่อไปจาก input queue

# รันโค้ดที่ส่งมาจากไคลเอนต์
${currentCode}
`;

    const filePath = path.join(__dirname, "temp.py");

    fs.writeFile(filePath, codeTemplate, (err) => {
      if (err) {
        return res.json({ output: "", error: "Error writing file" }); // จัดการข้อผิดพลาดการเขียนไฟล์
      }

      // เรียกใช้ Python
      exec(`python3 ${filePath}`, (error, stdout, stderr) => {
        fs.unlink(filePath, () => {}); // ลบไฟล์ชั่วคราวหลังจากรันเสร็จ

        // ตรวจสอบผลลัพธ์
        if (stderr) {
          console.error(stderr); // แสดงข้อผิดพลาดใน console
          return res.json({ output: "", error: stderr }); // ส่งข้อผิดพลาดกลับไป
        }

        // ส่ง output กลับไปยังไคลเอนต์
        res.json({ output: stdout.trim(), error: "" }); // ส่งผลลัพธ์ที่ได้จากการรัน
      });
    });
  }
});

// ฟังก์ชันสำหรับการจัดการ input จากผู้ใช้
app.post("/send-input", (req, res) => {
  if (!waitingForInput) {
    return res.json({ success: false, error: "ไม่อยู่ในสถานะรอข้อมูล" });
  }

  const userInput = req.body.userInput;
  inputQueue.push(userInput); // เพิ่มค่าที่ผู้ใช้ป้อนเข้าไปใน inputQueue

  // Prepare updated code with injected inputs
  const updatedCodeTemplate = `
input_values = ${JSON.stringify(inputQueue)};
def input(prompt=""):
    if not input_values:
        raise IndexError("รอข้อมูลเพิ่ม")
    return input_values.pop(0)

${currentCode}
`;

  const filePath = path.join(__dirname, "temp.py");

  fs.writeFile(filePath, updatedCodeTemplate, (err) => {
    if (err) {
      return res.json({ output: "", error: "Error writing file" });
    }

    exec(`python3 ${filePath}`, (error, stdout, stderr) => {
      fs.unlink(filePath, () => {});

      // Check if we are still waiting for input
      waitingForInput = stderr.includes("รอข้อมูลเพิ่ม");

      // Check for the next prompt based on input statements
      const inputRegex = /input\(["'](.*?)["']\)/g;
      const matches = Array.from(currentCode.matchAll(inputRegex));
      const nextPrompt = matches[inputQueue.length]
        ? matches[inputQueue.length][1]
        : null;

      if (waitingForInput && nextPrompt) {
        // หากรอข้อมูลและมี prompt ถัดไป ส่งกลับไป
        res.json({
          waitingForInput: true,
          prompt: nextPrompt,
          output: stdout.trim(),
        });
      } else if (error) {
        // ส่งกลับข้อผิดพลาดถ้ามี
        res.json({ output: "", error: stderr });
      } else {
        // ส่งผลลัพธ์สุดท้ายกลับไป
        res.json({ output: stdout.trim(), error: "" });
      }
    });
  });
});
// app.listen(5001, () => {
//   console.log("Server running on http://localhost:5002");
// });

app.post("/run-python-test", async (req, res) => {
  const code = req.body.code;
  const filePath = path.join(__dirname, "temp.py");

  try {
    const connection = await initializeDB();
    const idExe = req.body.id_exe;
    const iduserExe = req.body.id;
    const [results] = await connection.execute(
      "SELECT * FROM `answer` WHERE `id_exe` = ?",
      [idExe]
    );

    const allResults = []; // Array สำหรับเก็บผลลัพธ์ทั้งหมด
    console.log(code)
  
    for (const val of results) {
      // ตรวจสอบว่าคำตอบในฐานข้อมูลต้องการ input แต่โค้ดของผู้ใช้ไม่มีการใช้ input()
      if (val.ans_input && !code.includes("input(")) {
        allResults.push({
          output: "",
          error: "Error: Expected input in the code but none was found.",
          score: 0,
        });
        continue;
      }

      let updatedCode = code;

      if (val.ans_input) {
        const inputCommands = val.ans_input
          .split("\n")
          .map((inputVal) => `input_values.append('${inputVal.trim()}')`)
          .join("\n");

        updatedCode = `
input_values = []
def input(prompt=''):
    return input_values.pop(0)
${inputCommands}
${code}
        `;
      }

      await fs.promises.writeFile(filePath, updatedCode);
      const execPromise = new Promise((resolve) => {
        exec(`python3 ${filePath}`, (error, stdout, stderr) => {
          fs.unlink(filePath, () => {}); // ลบไฟล์ชั่วคราวหลังจากรันเสร็จสิ้น

          if (error) {
            resolve({ output: "", error: stderr, score: 0 });
          } else {
            const ansOutputTrimmed = val.ans_output.trim().toLowerCase();
            const stdoutTrimmed = stdout.trim().toLowerCase();

            const distance = levenshtein.get(ansOutputTrimmed, stdoutTrimmed);
            const maxLen = Math.max(ansOutputTrimmed.length, stdoutTrimmed.length);
            const similarity = ((maxLen - distance) / maxLen) * 100;
            const score = Math.round(similarity);

            resolve({ output: stdout, error: "", score });
          }
        });
      });

      const result = await execPromise;
      allResults.push(result); // เก็บผลลัพธ์ของแต่ละรอบลงใน allResults
    }
    res.json(allResults); // ส่งผลลัพธ์ทั้งหมดกลับไปยัง client
  } catch (err) {
    console.error("Error querying the database:", err);
    res.json({ output: "", error: "Error querying the database" });
  }
});
app.get("/send-data-chapter", async (req, res) => {
  let connection;
  try {
    connection = await initializeDB(); // เรียกการเชื่อมต่อฐานข้อมูล
    const id = "fcf470ca-9ee3-11ef-a194-4e0b845de94b";
    const [rows] = await connection.execute(
      `
      SELECT 
    ROUND(avg_data.avg_score, 2) AS avg_score,
    chapter.chapter_id,
    chapter.name,
    chapter.assigned_end
FROM 
    user
LEFT JOIN 
    user_exercise ON user.user_id = user_exercise.id_user
LEFT JOIN 
    exercise ON user_exercise.id_exe = exercise.exe_id
LEFT JOIN 
    chapter ON exercise.id_chapter = chapter.chapter_id
LEFT JOIN (
    SELECT  
        id_user,
        id_chapter,
        ROUND(SUM(score) / COUNT(*), 2) AS avg_score
    FROM 
        user_exercise
    LEFT JOIN 
        exercise ON user_exercise.id_exe = exercise.exe_id
    WHERE 
        id_user = ?
    GROUP BY 
        id_chapter, id_user
) AS avg_data ON chapter.chapter_id = avg_data.id_chapter
WHERE 
    user.user_id = ?
    AND chapter.delete_up IS NULL;`,
      [id,id]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.end(); // ปิดการเชื่อมต่อ
    }
  }
});

app.get("/send-data-exercises", async (req, res) => {
  let connection;
  try {
    connection = await initializeDB(); // เรียกการเชื่อมต่อฐานข้อมูล
    const id_chapter = req.query.id_chapter;
    const id_user = req.query.id_user;

    const [rows] = await connection.execute(
      `
        SELECT *,user_exercise.score FROM  user_exercise
LEFT join exercise on  exercise.exe_id = user_exercise.id_exe
LEFT join chapter on exercise.id_chapter = chapter.chapter_id
where chapter.chapter_id = ?  and user_exercise.id_user = ?`,
      [id_chapter, id_user]
    );
    console.log(rows)
    res.json({ data: rows });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.end(); // ปิดการเชื่อมต่อ
    }
  }
});

app.get("/send-work-exercises", async (req, res) => {
  let connection;
  try {
    connection = await initializeDB(); // เรียกการเชื่อมต่อฐานข้อมูล
    const id_chapter = "1";
    const id_userExe = req.query.id_userExe;

    const [rows] = await connection.execute(
      `SELECT * FROM exercise
LEFT join answer on exercise.exe_id = answer.id_exe
left join user_exercise on exercise.exe_id =  user_exercise.id_exe 
where user_exercise.user_exe_id = ?
`,
      [id_userExe]
    );

    res.json({ data: rows });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.end(); // ปิดการเชื่อมต่อ
    }
  }
});




app.post("/send-send-score", async (req, res) => {
  let connection;
  try {
    connection = await initializeDB(); // เรียกการเชื่อมต่อฐานข้อมูล

    const code = req.body.code; // ดึง code จาก body ของ request
    const iduserExe = req.body.id; // ดึง iduserExe จาก body ของ request
    const Score = req.body.averageScore; // ดึง Score จาก body ของ request

    if (!code || !iduserExe || Score == null) { // ตรวจสอบว่าทุกค่ามีค่าหรือไม่
      return res.status(400).json({ error: "Missing required fields" });
    }

    const [update_code] = await connection.execute(
      `UPDATE user_exercise SET code = ?, complate_status = 1, score = ? WHERE user_exe_id = ?`,
      [code, Score, iduserExe]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) {
      await connection.end(); // ปิดการเชื่อมต่อ
    }
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});





