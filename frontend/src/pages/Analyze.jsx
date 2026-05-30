import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

function Analyze() {

  const [text, setText] = useState("");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {

    if (!text.trim()) {

      toast.error(
        "Please enter text"
      );

      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        {
          text: text.trim()
        }
      );

      setResults(prev => [
        response.data,
        ...prev
      ]);

      setText("");

      toast.success(
        "Analysis completed"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Server Error"
      );

    } finally {

      setLoading(false);

    }

  };

  const clearHistory = () => {

    setResults([]);

    toast.info(
      "Analysis history cleared"
    );

  };

  const handleKeyDown = (e) => {

    if (
      e.ctrlKey &&
      e.key === "Enter"
    ) {

      analyzeText();

    }

  };

  return (

    <div className="analyze-page">

      <motion.div
        className="analyze-card"
        initial={{
          opacity: 0,
          y: 30
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
      >

        <h1>
          🤖 AI Sentiment Analysis
        </h1>

        <p className="analyze-subtitle">

          Enter any review,
          feedback or comment
          and AI will detect
          sentiment instantly.

        </p>

        <textarea
          value={text}
          placeholder="Write text for analysis..."
          onChange={(e) =>
            setText(e.target.value)
          }
          onKeyDown={handleKeyDown}
        />

        <div
          style={{
            display: "flex",
            gap: "10px"
          }}
        >

          <button
            className="analyze-btn"
            onClick={analyzeText}
            disabled={loading}
          >

            {
              loading
                ? "Analyzing..."
                : "Analyze Text"
            }

          </button>

          <button
            className="analyze-btn"
            onClick={clearHistory}
          >

            Clear

          </button>

        </div>

        {results.length > 0 && (

          <div
            style={{
              marginTop: "30px"
            }}
          >

            <h2>
              Analysis Results
            </h2>

            {

              results.map(
                (result, index) => (

                  <motion.div
                    key={index}
                    className="result-box"
                    initial={{
                      opacity: 0
                    }}
                    animate={{
                      opacity: 1
                    }}
                  >

                    <div
                      className={
                        result.sentiment === "Positive"
                          ? "positive-result"
                          : result.sentiment === "Negative"
                          ? "negative-result"
                          : "neutral-result"
                      }
                    >

                      {
                        result.sentiment
                      }

                    </div>

                    <h3>

                      Confidence:
                      {" "}
                      {
                        result.confidence
                      }%

                    </h3>

                    <div
                      className="review-preview"
                    >

                      <h3>
                        Text
                      </h3>

                      <p>
                        {
                          result.text
                        }
                      </p>

                    </div>

                    <div>

                      <h3>
                        Positive Keywords
                      </h3>

                      <p>

                        {
                          result
                            .positive_keywords
                            ?.length > 0
                            ? result
                                .positive_keywords
                                .join(", ")
                            : "None"
                        }

                      </p>

                    </div>

                    <div>

                      <h3>
                        Negative Keywords
                      </h3>

                      <p>

                        {
                          result
                            .negative_keywords
                            ?.length > 0
                            ? result
                                .negative_keywords
                                .join(", ")
                            : "None"
                        }

                      </p>

                    </div>

                  </motion.div>

                )
              )

            }

          </div>

        )}

      </motion.div>

    </div>

  );

}

export default Analyze;