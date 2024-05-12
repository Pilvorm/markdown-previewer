import "./App.css";
import React from "react";
import { marked } from "marked";
import Prism from "prismjs";
import { motion } from "framer-motion";

marked.setOptions({
  breaks: true,
  highlight: function (code) {
    return Prism.highlight(code, Prism.languages.javascript, "javascript");
  },
});

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}</a>`;
};

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lightTheme: true,
      markdown: placeholder,
      editorMaximized: false,
      previewMaximized: false,
    };

    this.handleTheme = this.handleTheme.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEditorMaximize = this.handleEditorMaximize.bind(this);
    this.handlePreviewMaximize = this.handlePreviewMaximize.bind(this);
  }

  handleTheme() {
    this.setState({
      lightTheme: !this.state.lightTheme,
    });
  }

  handleChange(e) {
    this.setState({
      markdown: e.target.value,
    });
  }

  handleEditorMaximize() {
    this.setState({
      editorMaximized: !this.state.editorMaximized,
    });
  }

  handlePreviewMaximize() {
    this.setState({
      previewMaximized: !this.state.previewMaximized,
    });
  }

  render() {
    const themeClass = this.state.lightTheme
      ? ["light", "dark_mode"]
      : ["dark", "light_mode"];

    const classes = this.state.editorMaximized
      ? ["editor-side maximized", "preview-side hide", "close_fullscreen"]
      : this.state.previewMaximized
      ? ["editor-side hide", "preview-side maximized", "close_fullscreen"]
      : ["editor-side", "preview-side", "open_in_full"];

    return (
      <motion.div className={`App ${themeClass[0]}`}>
        <Header onClick={this.handleTheme} themeIcon={themeClass[1]} />
        <motion.div
          className="main"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.75 }}
        >
          <div className={classes[0]}>
            <Toolbar
              icon="edit"
              sizing={classes[2]}
              onClick={this.handleEditorMaximize}
              text="Editor"
              theme={themeClass[0]}
            />

            <Editor
              markdown={this.state.markdown}
              onChange={this.handleChange}
              theme={themeClass[0]}
            />
          </div>

          <div className={classes[1]}>
            <Toolbar
              icon="preview"
              sizing={classes[2]}
              onClick={this.handlePreviewMaximize}
              text="Preview"
              theme={themeClass[0]}
            />

            <Preview markdown={this.state.markdown} />
          </div>
        </motion.div>
      </motion.div>
    );
  }
}

const Header = (props) => {
  return (
    <header>
      <div className="title">
        <h1>Markdown Previewer</h1>
        <p>by Daniel Emerald</p>
      </div>
      <div className="action">
        <motion.span
          className="material-symbols-outlined"
          onClick={props.onClick}
          whileHover={{ scale: 1.2, rotate: 30 }}
        >
          {props.themeIcon}
        </motion.span>
      </div>
    </header>
  );
};

const Toolbar = (props) => {
  return (
    <div className={`toolbar toolbar-${props.theme}`}>
      <span className="material-symbols-outlined tool-icon">{props.icon}</span>
      {props.text}
      <span
        className={`material-symbols-outlined cursor-pointer sizing`}
        onClick={props.onClick}
        style={{color: props.theme === "dark" ? "white" : ""}}
      >
        {props.sizing}
      </span>
    </div>
  );
};

const Editor = (props) => {
  return (
    <textarea
      id="editor"
      onChange={props.onChange}
      type="text"
      value={props.markdown}
      className={props.theme}
    />
  );
};

const Preview = (props) => {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: marked(props.markdown, { renderer: renderer }),
      }}
      id="preview"
    />
  );
};

const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Here's some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There are also [links](https://codepen.io/collection/bNRLWQ), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course, there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbered lists too.
1. Use just 1s if you want!
1. And last but not least, let's not forget embedded images:

![freeCodeCamp Logo](https://cdn.freecodecamp.org/testable-projects-fcc/images/fcc_secondary.svg)
`;

export default App;
