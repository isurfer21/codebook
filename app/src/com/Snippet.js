import React, { useState, useRef } from "react";
import axios from "axios";
import Markdown from "react-markdown";

function Snippet({ id, trait, onChange, onTrash }) {
  const textareaRef = useRef(null);

  const [codeType, setCodeType] = useState(trait.type || "");
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
        setOutput(error.response.data?.error || error.response.data);
      });
    save();
  };

  const handleClickTrash = () => onTrash(id);

  const save = () =>
    onChange(id, {
      code: codeText,
      lang: codeLang,
      file: codeFile,
      cede: output,
    });

  const [markedEditor, setMarkedEditor] = useState(true);

  const handleClickMarkdown = () => setMarkedEditor(true);

  const handleBlurTextarea = () => setMarkedEditor(false);

  return (
    <section className="section mt-3 p-5 mdl-card mdl-card-1">
      {codeType === "code" ? (
        <>
          <textarea
            ref={textareaRef}
            name="code"
            cols="30"
            rows="10"
            className="textarea"
            value={codeText}
            placeholder={
              codeLang ? `Enter the ${codeLang} code.` : `Select a language.`
            }
            onChange={handleChangeCodeText}
            spellCheck="false"
          />
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
              <button
                className="button is-small is-primary"
                onClick={handleClickRun}
              >
                ►
              </button>
              <button
                className="button is-small is-warning ml-2"
                onClick={handleClickTrash}
              >
                🗑
              </button>
            </div>
            <div className="column">
              <div className="select is-small is-pulled-right">
                <select onChange={handleChangeCodeLang} defaultValue={codeLang}>
                  <option value="">Select language</option>
                  <option value="php">PHP</option>
                  <option value="js">JavaScript</option>
                  <option value="node">Node.js</option>
                  <option value="go">Go</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>
          </div>
          <div>
            <pre className="bg-slate-900 text-white rounded text-sm">
              <code>{output || "Not available"}</code>
            </pre>
          </div>
        </>
      ) : (
        <>
          {markedEditor ? (
            <textarea
              ref={textareaRef}
              name="markdown"
              rows="5"
              className="textarea"
              value={codeText}
              placeholder="Enter the markdown text."
              onChange={handleChangeCodeText}
              onBlur={handleBlurTextarea}
            />
          ) : (
            <div className="reset-style" onClick={handleClickMarkdown}>
              <Markdown>{codeText}</Markdown>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default Snippet;
