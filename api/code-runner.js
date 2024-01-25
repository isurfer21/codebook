const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const stripColorCodes = require("stripcolorcodes");

const CodeExt = {
  node: "js",
  js: "js",
  php: "php",
  go: "go",
  java: "java",
  py: "py",
  lua: "lua",
  wren: "wren",
  rs: "rs",
};

const getCodeRunCmd = (langId, filePath) => {
  let codeRunCmd;
  const baseDirectory = path.dirname(filePath);
  const baseFilename = path.parse(filePath).name;
  console.log(filePath, baseDirectory, baseFilename);
  switch (langId) {
    case "node":
      codeRunCmd = `node ${filePath}`;
      break;
    case "js":
      codeRunCmd = `node ${filePath}`;
      break;
    case "php":
      codeRunCmd = `php ${filePath}`;
      break;
    case "go":
      codeRunCmd = `go run ${filePath}`;
      break;
    case "java":
      codeRunCmd = `javac ${filePath} && cd ${baseDirectory} && java ${baseFilename}`;
      break;
    case "py":
      codeRunCmd = `python ${filePath}`;
      break;
    case "lua":
      codeRunCmd = `lua ${filePath}`;
      break;
    case "wren":
      codeRunCmd = `wren ${filePath}`;
      break;
    case "rs":
      codeRunCmd = `rustc ${filePath} && cd ${baseDirectory} && ${path.resolve('.', baseFilename)}`;
      break;
  }
  return codeRunCmd;
};

module.exports = function (req, res) {
  // Get the code from the request body
  const codeText = req.body.code;
  const codeLang = req.body.lang;
  const codeFile = req.body.file || "code";

  if (!!codeText) {
    // Create a temporary file to store the code
    const tempDir = fs.mkdtempSync(path.resolve('.temp', 'cb_'));
    const fileName = `${codeFile}.${CodeExt[codeLang]}`;
    const filePath = path.resolve(tempDir, fileName);
    fs.writeFileSync(filePath, codeText);

    // Execute the code and capture the output
    const command = getCodeRunCmd(codeLang, filePath);

    exec(command, (error, stdout, stderr) => {
      // Delete the temporary file and folder
      fs.unlinkSync(filePath);
      fs.rmdirSync(tempDir, { recursive: true });

      // Handle errors
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (stderr) {
        return res.status(400).json({ error: stderr });
      }

      // Return the output as JSON
      res.json({ output: stripColorCodes(stdout) });
    });
  } else {
    return res.status(500).json({ error: `Invalid argument 'code'` });
  }
};
