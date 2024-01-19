import { useState } from "react";
import axios from "axios";

function Snippet({ id, trait, onChange, onTrash }) {
  const [codeText, setCodeText] = useState(trait.code || "");
  const [codeLang, setCodeLang] = useState(trait.lang || "");
  const [codeFile, setCodeFile] = useState(trait.file || "");
  const [output, setOutput] = useState(trait.cede);

  const handleChangeCodeText = (event) => setCodeText(event.target.value);

  const handleChangeCodeLang = (event) => setCodeLang(event.target.value);

  const handleChangeCodeFile = (event) => setCodeFile(event.target.value);

  const handleClickRun = () => {
    axios
      .post("/api/run", {
        code: codeText,
        lang: codeLang,
        file: codeFile,
      })
      .then((response) => {
        console.log(response);
        setOutput(response.data.output);
      })
      .catch((error) => {
        console.error(error);
        setOutput(error.response.data.error);
      });
    reviseTrait();
  };

  const handleClickTrash = () => onTrash(id);

  const reviseTrait = () =>
    onChange(id, {
      code: codeText,
      lang: codeLang,
      file: codeFile,
      cede: output,
    });

  return (
    <section className="section mt-3 has-background-primary-light">
      <textarea
        name="code"
        cols="30"
        rows="10"
        className="textarea"
        value={codeText}
        onChange={handleChangeCodeText}
      ></textarea>
      <div className="my-0 columns">
        <div className="column">
          <input
            className="input is-small"
            type="text"
            placeholder="Filename (Optional)"
            value={codeFile}
            onChange={handleChangeCodeFile}
          />
        </div>
        <div className="column">
          <button className="button is-small is-primary" onClick={handleClickRun}>
            ►
          </button>
          <button className="button is-small is-warning ml-2" onClick={handleClickTrash}>
            🗑
          </button>
        </div>
        <div className="column">
          <div className="select is-small is-pulled-right">
            <select onChange={handleChangeCodeLang} defaultValue={codeLang}>
              <option value="php">PHP</option>
              <option value="js">JavaScript</option>
              <option value="node">Node.js</option>
              <option value="go">Go</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
      </div>
      <div className="">
        <pre>
          <code>{output}</code>
        </pre>
      </div>
    </section>
  );
}

export default Snippet;
