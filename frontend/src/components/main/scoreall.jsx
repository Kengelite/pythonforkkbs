import { React } from "react";
import { Link } from "react-router-dom";

export default function ScoreallPage() {
  const todoListquiz = [
    {
      id: "quiz1",
      name: "อภิภัทร คำพุทธ",
      score: 75,
      status_now: true,
    },
    {
      id: "quiz2",
      name: "อภิภัทร คำพุทธหกหกหกห",
      score: 75,
      status_now: true,
    },
    {
      id: "quiz3",
      name: "อภิภัทร คำพุทธหกหกหกห",
      score: 75,
      status_now: true,
    },
    {
      id: "quiz4",
      name: "อภิภัทร คำพุทธหกหกหกหฟหกฟก",
      score: 100,
      status_now: true,
    },
    {
      id: "quiz5",
      name: "อภิภัทร คำพุทธหกหกหกหำไำไ",
      score: 75,
      status_now: true,
    },
    {
      id: "quiz6",
      name: "อภิภัทร คำพุทธหกหกหกหไำไ",
      score: 50,
      status_now: true,
    },
  ];
  return (
    <>
      <h2 className="mt-5">Ranking </h2>
      <table className="table mt-4">
        <thead>
          <tr>
            <th scope="col">ลำดับ </th>
            <th scope="col">ชื่อ</th>
            <th scope="col" className="ps-5">
              คะแนน
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {todoListquiz.map((todo, index) => {
            return (
              <>
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{todo.name} </td>
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

                  <td>
                    <Link to={`/Exercises/${todo.id}`} className="ps-5">
                      <button className="btn btn-warning"> ทำแบบฝึกหัด</button>
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
