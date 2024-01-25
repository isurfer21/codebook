const fs = require("fs").promises;
const path = require("path");

const fileName = "language-config.json";
const filePath = path.resolve(fileName);

module.exports = async function(req, res) {
  try {
    const data = await fs.readFile(filePath, "utf8");
    const langObj = await JSON.parse(data);
    let langMap = {};
    for (let key in langObj) {
      langMap[key] = langObj[key].label
    }
    // Return the output as JSON
    res.json({ output: langMap });
  } catch (err) {
    // Handle any errors that occur
    console.error(err);
    return res.status(500).json({ error: `Something went wrong!` });
  }
};
