const fs = require("fs").promises;
const path = require("path");
const { exec } = require("child_process");
const stripColorCodes = require("stripcolorcodes");

const LANGUAGE_CONFIG_FILE = "language-config.json"

const loadConfig = async () => {
  const filePath = path.resolve(LANGUAGE_CONFIG_FILE);
  const data = await fs.readFile(filePath, "utf8");
  return await JSON.parse(data);
};

const fixIn = (template, hashtable) => {
  var tag,
    output = template;
  for (var key in hashtable) {
    tag = new RegExp(`<${key}>`, "g");
    output = output.replace(tag, hashtable[key]);
  }
  return output;
};

const getCodeRunCmd = (langCmd, filePath) => {
  const baseDirectory = path.dirname(filePath);
  const baseFilename = path.parse(filePath).name;
  const baseFilePath = path.resolve(".", baseFilename);
  let codeRunCmd = fixIn(langCmd, {
    FILE_PATH: filePath,
    BASE_DIR: baseDirectory,
    BASE_FILE: baseFilePath,
  });
  return codeRunCmd;
};

module.exports = async function (req, res) {
  // Get the code from the request body
  const codeText = req.body.code;
  const codeLang = req.body.lang;
  const codeFile = req.body.file || "code";

  if (!!codeText) {
    try {
      const languages = await loadConfig();

      // Create a temp directory using fs.mkdtemp()
      const tempDir = await fs.mkdtemp(path.resolve(".temp", "cb_"));
      const fileName = `${codeFile}.${languages[codeLang].ext}`;
      const filePath = path.resolve(tempDir, fileName);

      // Write the code text to the temp file using fs.writeFile()
      await fs.writeFile(filePath, codeText);

      // Execute the code and capture the output
      const command = getCodeRunCmd(languages[codeLang].cmd, filePath);

      exec(command, (error, stdout, stderr) => {
        // Delete the temporary file and folder using fs.rm()
        fs.rm(tempDir, { recursive: true }, (err) => {
          if (err) throw err;
        });

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
    } catch (err) {
      // Handle any errors that occur
      console.error(err);
      return res.status(500).json({ error: `Something went wrong!` });
    }
  } else {
    return res.status(500).json({ error: `Invalid argument 'code'` });
  }
};
