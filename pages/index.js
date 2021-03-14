import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.less";
import BackentWorker from "../backend/backend.worker";
export default function Home() {
  const [cols, setCols] = useState(50);
  const [rows, setRows] = useState(10);
  const [input, setInput] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [logs, setLogs] = useState([]);
  function log(value) {
    setLogs([
      ...logs.slice(Math.max(0, logs.length - 100)),
      <pre key={Math.random().toString(16).substr(2)}>{value}</pre>,
    ]);
  }
  function handleInput(input) {
    console.log(input);
    log(input);
  }
  useEffect(() => {
    const handler = () => {
      setCols(Math.floor(window.innerWidth / 9.86));
      setRows(Math.floor(window.innerHeight / 20));
    };
    handler();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return (
    <>
      <Head>
        <title>egg</title>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/tonsky/FiraCode@4/distr/fira_code.css"
        />
      </Head>
      <label htmlFor="input" className={styles.Hero}>
        <div className={styles.Messages}>{logs}</div>
        <div className={styles.InputDisplay}>
          <div
            className={styles.Cursor}
            style={{ left: 9.86 * selectionStart }}
          >
            {input.length > selectionStart ? input.charAt(selectionStart) : ""}
          </div>
          {selectionStart != selectionEnd && (
            <div
              className={styles.Select}
              style={{
                left: 9.86 * selectionStart,
                width: `${(selectionEnd - selectionStart) * 9.86}px`,
              }}
            >
              <pre>{input.substring(selectionStart, selectionEnd)}</pre>
            </div>
          )}
          <p>{input}</p>
          <textarea
            id="input"
            cols={cols}
            rows={rows}
            className={styles.Input}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setSelectionStart(e.target.selectionStart);
              setSelectionEnd(e.target.selectionEnd);
            }}
            onKeyDown={(e) => {
              setSelectionStart(e.currentTarget.selectionStart);
              setSelectionEnd(e.currentTarget.selectionEnd);
              if (e.code === "Enter") {
                handleInput(e.currentTarget.value.replace(/\n/g, "").trim());
                setSelectionStart(0);
                setSelectionEnd(0);
                setInput("");
                setTimeout(() => setInput(""));
              }
            }}
            onKeyUp={(e) => {
              setSelectionStart(e.currentTarget.selectionStart);
              setSelectionEnd(e.currentTarget.selectionEnd);
            }}
          ></textarea>
        </div>
      </label>
    </>
  );
}
