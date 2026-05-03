export const runMacroProcessor = async (code, mode) => {
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

      // ✅ ALWAYS PASS 1
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

            mnt.push({ index: mntIndex++, name: macroName });
            mdt.push({ index: mdtIndex++, definition: line });

            currentMacroLines.push(line);
          } else {
            mdt.push({ index: mdtIndex++, definition: line });
            currentMacroLines.push(line);
          }
        }
      }

      // PASS 2 (same as before)
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