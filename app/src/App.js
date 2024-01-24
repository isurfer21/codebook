import { useState, useId } from "react";
import "./App.css";
import Header from "./com/Header";
import Snippet from "./com/Snippet";
import Footer from "./com/Footer";

const SnippetModel = {
  code: "",
  lang: "",
  file: "",
  cede: "",
};

function App() {
  const [snippets, setSnippets] = useState([]);

  const addNewSnippet = () => {
    const lastUsedLang = snippets.length > 0 ? snippets[snippets.length - 1].lang : "";
    const snippet = { ...SnippetModel };
    snippet.lang = lastUsedLang;
    setSnippets([...snippets, snippet]);
  };

  const addNewMarkdown = ()  => {

  };

  const id = useId();

  const updateSnippet = (index, snippet) => {
    const list = [...snippets];
    list[index] = snippet;
    setSnippets(list);
  };

  const deleteSnippet = (index) => {
    setSnippets(snippets.filter((snippet, i) => i !== index));
  };

  return (
    <div className="bg-slate-50">
      <Header />
      <div className="container is-widescreen">
        <div>
          {!!snippets &&
            snippets.map((snippet, index) => {
              return (
                <Snippet
                  key={id + index}
                  id={index}
                  trait={snippet}
                  onChange={updateSnippet}
                  onTrash={deleteSnippet}
                />
              );
            })}
        </div>
        <div className="mt-2 has-text-centered">
          <button
            className="button is-info is-small is-light is-rounded"
            onClick={addNewSnippet}
          >
            <b>+</b>&nbsp;Code
          </button>
          <button
            className="button is-info is-small is-light is-rounded ml-2"
            onClick={addNewMarkdown}
          >
            <b>+</b>&nbsp;Markdown
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
