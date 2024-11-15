
import AOS from "aos";
import "aos/dist/aos.css";
import React, { useEffect, useState } from "react";
import "../css/content.css";
import { Link } from "react-router-dom";

export function Contentmain() {
  const todoListquiz = [
    {
      id : "quiz1",
      name_quiz: "แบบทดสอบบทที่ 1 ",
      score: 75,
      status_now: true,
    },
    {
      id : "quiz2",
      name_quiz: "แบบทดสอบบทที่ 2 ",
      score: 75,
      status_now: true,
    },
    {
      id : "quiz3",
      name_quiz: "แบบทดสอบบทที่ 3 ",
      score: 75,
      status_now: true,
    },
    {
      id : "quiz4",
      name_quiz: "แบบทดสอบบทที่ 4 ",
      score: 100,
      status_now: true,
    },
    {
      id : "quiz5",
      name_quiz: "แบบทดสอบบทที่ 5 ",
      score: 75,
      status_now: true,
    },
    {
      id : "quiz6",
      name_quiz: "แบบทดสอบบทที่ 6 ",
      score: 50,
      status_now: true,
    },
    {
      id : "quiz7",
      name_quiz: "แบบทดสอบบทที่ 7 ",
      score: 0,
      status_now: false,
    },
    {
      id : "quiz8",
      name_quiz: "แบบทดสอบบทที่ 8 ",
      score: 0,
      status_now: false,
    },
    {
      id : "quiz9",
      name_quiz: "แบบทดสอบบทที่ 9 ",
      score: 0,
      status_now: false,
    },
    {
      id : "quiz10",
      name_quiz: "แบบทดสอบบทที่ 10 ",
      score: 0,
      status_now: false,
    },
  ];
  
  return (
    <>
      <h2 className="mt-5">แบบฝึกหัดชุดที่ 1</h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ชื่อ</th>
            <th scope="col" className="ps-5">คะแนน</th>
            <th scope="col" className="ps-3">
              สถานะ
            </th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {todoListquiz.map((todo, index) => {
            return (
              <>
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{todo.name_quiz} </td>
                  <td>
                    <div
                      className="progress "
                      role="progressbar"
                      aria-label="Animated striped example"
                      aria-valuenow={todo.score}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <div
                        className="progress-bar progress-bar-striped progress-bar-animated "
                        style={{ width: `${todo.score}%` }}
                      >
                        {todo.score} %
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
                    <Link to={`/Exercises/${todo.id}`} >
                      <button className="btn btn-warning" > ทำแบบฝึกหัด</button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/send-exercises/${todo.id}`} className="ps-5">
                      <button className="btn btn-warning"> ทำแบบฝึกหัด</button>
                    </Link>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
