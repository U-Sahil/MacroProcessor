import { useState } from "react";
import "./App.css";

// -----------------------------
// MOCK MACRO PROCESSOR BACKEND
// -----------------------------
const runMacroProcessor = async (code, mode) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const lines = code.split("\n").map(l => l.trim());

      let mnt = [];
      let mdt = [];

      let macroTable = {};
      let inMacro = false;
      let macroName = "";
      let mdtIndex = 1;
      let mntIndex = 1;
      let currentMacroLines = [];

      let expandedCode = [];
      let errors = [];

      // =====================
      // PASS 1
      // =====================
      if (mode === "pass1" || mode === "full") {
        for (let line of lines) {
          if (!line) continue;

          if (line === "MACRO") {
            inMacro = true;
            currentMacroLines = [];
            macroName = "";
            continue;
          }

          if (inMacro) {
            if (line === "MEND") {
              mdt.push({ index: mdtIndex++, definition: "MEND" });
              macroTable[macroName] = [...currentMacroLines];

              inMacro = false;
              continue;
            }

            if (!macroName) {
              const parts = line.split(/\s+/);
              macroName = parts[0];

              mnt.push({
                index: mntIndex++,
                name: macroName
              });

              mdt.push({
                index: mdtIndex++,
                definition: line
              });

              currentMacroLines.push(line);
            } else {
              mdt.push({
                index: mdtIndex++,
                definition: line
              });

              currentMacroLines.push(line);
            }
          }
        }
      }

      // =====================
      // PASS 2
      // =====================
      if (mode === "pass2" || mode === "full") {
        let isMacro = false;

        for (let line of lines) {
          if (!line) continue;

          if (line === "MACRO") {
            isMacro = true;
            continue;
          }

          if (line === "MEND") {
            isMacro = false;
            continue;
          }

          if (isMacro) continue;

          const parts = line.split(/\s+/);
          const word = parts[0];

          if (macroTable[word]) {
            const args = parts.slice(1);

            macroTable[word].forEach(mLine => {
              let expanded = mLine;

              args.forEach((arg, i) => {
                expanded = expanded.replace(`&ARG${i + 1}`, arg);
              });

              expandedCode.push(expanded);
            });

          } else {
            expandedCode.push(line);
          }
        }
      }

      resolve({
        mnt,
        mdt,
        expandedCode: expandedCode.join("\n"),
        errors
      });

    }, 800);
  });
};

// -----------------------------
// MAIN APP
// -----------------------------
export default function App() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("full");
  const [loading, setLoading] = useState(false);

  const handleRun = async () => {
    if (!code.trim()) {
      alert("Please enter macro code");
      return;
    }

    setLoading(true);
    const data = await runMacroProcessor(code, mode);
    setResult(data);
    setLoading(false);
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
  };

  return (
    <div className="container">

      <h1>Macro Processor</h1>

      {/* INPUT */}
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter macro program..."
      />

      {/* MODE SELECT */}
      <div style={{ marginTop: "10px" }}>
        <button
          className={mode === "pass1" ? "active" : ""}
          onClick={() => setMode("pass1")}
        >
          Pass 1
        </button>

        <button
          className={mode === "pass2" ? "active" : ""}
          onClick={() => setMode("pass2")}
        >
          Pass 2
        </button>

        <button
          className={mode === "full" ? "active" : ""}
          onClick={() => setMode("full")}
        >
          Full Run
        </button>
      </div>

      {/* ACTIONS */}
      <div>
        <button onClick={handleRun}>Run</button>
        <button onClick={handleClear}>Clear</button>
      </div>

      {loading && <p>Processing...</p>}

      {/* OUTPUT */}
      {result && !loading && (
        <div className="output-box">

          <h2>✔ Pass 1 Output</h2>

          <h3>MNT (Macro Name Table)</h3>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Index</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {result.mnt.map((item, i) => (
                <tr key={i}>
                  <td>{item.index}</td>
                  <td>{item.name}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>MDT (Macro Definition Table)</h3>
          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Index</th>
                <th>Definition</th>
              </tr>
            </thead>
            <tbody>
              {result.mdt.map((item, i) => (
                <tr key={i}>
                  <td>{item.index}</td>
                  <td>{item.definition}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2>✔ Pass 2 Output</h2>

          <h3>Final Expanded Code</h3>
          <pre>{result.expandedCode || "N/A"}</pre>

          <h3>Errors</h3>
          <pre>
            {result.errors.length
              ? result.errors.join("\n")
              : "No Errors"}
          </pre>

        </div>
      )}

    </div>
  );
}