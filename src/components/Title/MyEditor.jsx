import React, { useState, useEffect, useRef } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  Modifier,
  ContentState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";

// Custom style map for RED, UNDERLINE, and HEADING
const customStyleMap = {
  RED: { color: "red" },
  UNDERLINE: { textDecoration: "underline" },
};

const MyEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const editorRef = useRef(null); // Use useRef to create a reference

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);

  const saveContent = () => {
    const content = editorState.getCurrentContent();
    localStorage.setItem("editorContent", JSON.stringify(convertToRaw(content)));
    alert("Content saved!");
  };

  const handleBeforeInput = (input) => {
    const currentContent = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const blockText = currentContent.getBlockForKey(blockKey).getText();

    console.log("Current Input:", input);
    console.log("Current Block Text:", blockText);

    // Handle # + space for Heading (header-one)
    if (input === " " && blockText.startsWith("#")) {
      console.log("Heading detected, converting...");

      // Remove the "#" and space, and apply the header-one block type
      const newText = blockText.slice(1).trim(); // Remove the "#" and leading space
      const contentState = Modifier.replaceText(
        currentContent,
        selection,
        newText
      );
      const newEditorState = EditorState.push(
        editorState,
        contentState,
        "insert-characters"
      );

      // Apply the header-one block type to the current block
      const updatedEditorState = RichUtils.toggleBlockType(
        newEditorState,
        "header-one"
      );

      setEditorState(updatedEditorState);
      return "handled"; // Prevent default behavior
    }

    // Handle ** + space for RED
    if (input === " " && blockText === "**") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "RED"));
      return "handled";
    }

    // Handle *** + space for UNDERLINE
    if (input === " " && blockText === "***") {
      setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
      return "handled";
    }

    return "not-handled"; // Default behavior
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>My Editor</h1>
      <button onClick={saveContent}>Save</button>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          minHeight: "200px",
          marginTop: "20px",
        }}
        onClick={() => editorRef.current.focus()}
      >
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          customStyleMap={customStyleMap} // Pass the customStyleMap here
          handleBeforeInput={handleBeforeInput} // Attach handleBeforeInput here
        />
      </div>
    </div>
  );
};

export default MyEditor;
