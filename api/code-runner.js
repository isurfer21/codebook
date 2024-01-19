const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const stripColorCodes = require('stripcolorcodes');

const CodeExt = {
  node: "js",
  js: "js",
  php: "php",
  go: "go",
  java: "java",
};

const getCodeRunCmd = (langId, filePath) => {
  let codeRunCmd;
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
      const baseDirectory = path.dirname(filePath);
      const baseFilename = path.parse(filePath).name;
      codeRunCmd = `javac ${filePath} && cd ${baseDirectory} && java ${baseFilename}`;
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
    const temp = fs.mkdtempSync(".temp/");
    const file = `${temp}/${codeFile}.${CodeExt[codeLang]}`;
    fs.writeFileSync(file, codeText);

    // Execute the code and capture the output
    const command = getCodeRunCmd(codeLang, file);

    exec(command, (error, stdout, stderr) => {
      // Delete the temporary file and folder
      fs.unlinkSync(file);
      fs.rmdirSync(temp, { recursive: true });

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
