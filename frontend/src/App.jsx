import { useState } from "react";
import "./App.css";
import { runMacroProcessor } from "./utils/macroProcessor";

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

  const buttonBase =
    "px-4 py-2 mt-3 mr-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition";
  const activeButton =
    "bg-sky-400 text-black font-bold";

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-200 p-6 flex justify-center">
      <div className="w-full max-w-5xl">

        {/* TITLE */}
        <h1 className="text-center text-3xl text-sky-400 mb-6 tracking-wide">
          Macro Processor
        </h1>

        {/* INPUT */}
        <textarea
          className="w-full h-60 p-4 font-mono text-sm bg-gray-900 text-cyan-300 border border-gray-700 rounded-xl outline-none resize-none"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter macro program..."
        />

        {/* MODE SELECT */}
        <div className="mt-3">
          <button
            className={`${buttonBase} ${mode === "pass1" ? activeButton : ""}`}
            onClick={() => setMode("pass1")}
          >
            Pass 1
          </button>

          <button
            className={`${buttonBase} ${mode === "pass2" ? activeButton : ""}`}
            onClick={() => setMode("pass2")}
          >
            Pass 2
          </button>

          <button
            className={`${buttonBase} ${mode === "full" ? activeButton : ""}`}
            onClick={() => setMode("full")}
          >
            Full Run
          </button>
        </div>

        {/* ACTIONS */}
        <div>
          <button className={buttonBase} onClick={handleRun}>
            Run
          </button>
          <button className={buttonBase} onClick={handleClear}>
            Clear
          </button>
        </div>

        {loading && (
          <p className="text-yellow-400 font-bold mt-3">Processing...</p>
        )}

        {/* OUTPUT */}
        {result && !loading && (
          <div className="mt-6 bg-gray-900 p-5 rounded-xl border border-gray-700 shadow-lg">

            <h2 className="text-sky-400 text-xl mt-2 border-b border-gray-700 pb-1">
              Pass 1 Output
            </h2>

            <h3 className="text-sky-300 mt-4">MNT (Macro Name Table)</h3>
            <table className="w-full mt-2 bg-slate-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-sky-400">
                  <th className="p-2 text-left">Index</th>
                  <th className="p-2 text-left">Name</th>
                </tr>
              </thead>
              <tbody>
                {result.mnt.map((item, i) => (
                  <tr key={i} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-2">{item.index}</td>
                    <td className="p-2">{item.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 className="text-sky-300 mt-4">MDT (Macro Definition Table)</h3>
            <table className="w-full mt-2 bg-slate-900 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-800 text-sky-400">
                  <th className="p-2 text-left">Index</th>
                  <th className="p-2 text-left">Definition</th>
                </tr>
              </thead>
              <tbody>
                {result.mdt.map((item, i) => (
                  <tr key={i} className="border-t border-gray-700 hover:bg-gray-800">
                    <td className="p-2">{item.index}</td>
                    <td className="p-2">{item.definition}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-sky-400 text-xl mt-6 border-b border-gray-700 pb-1">
              Pass 2 Output
            </h2>

            <h3 className="text-sky-300 mt-4">Final Expanded Code</h3>
            <pre className="bg-[#0b1220] p-3 rounded-lg border border-gray-800 text-cyan-200 overflow-x-auto">
              {result.expandedCode || "N/A"}
            </pre>

            <h3 className="text-sky-300 mt-4">Errors</h3>
            <pre className="bg-[#0b1220] p-3 rounded-lg border border-gray-800 text-cyan-200">
              {result.errors.length
                ? result.errors.join("\n")
                : "No Errors"}
            </pre>

          </div>
        )}
      </div>
    </div>
  );
}