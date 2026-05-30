import { useEffect, useState } from "react";
import axios from "axios";

function History() {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response =
        await axios.get(
          "http://127.0.0.1:8000/history"
        );

      setHistory(response.data);

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <div className="page-container">

      <h1>Analysis History</h1>

      <table>

        <thead>

          <tr>

            <th>ID</th>

            <th>Text</th>

            <th>Sentiment</th>

          </tr>

        </thead>

        <tbody>

          {history.map((item) => (

            <tr key={item.id}>

              <td>{item.id}</td>

              <td>{item.text}</td>

              <td>{item.sentiment}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  );
}

export default History;