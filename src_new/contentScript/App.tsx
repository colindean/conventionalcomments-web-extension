import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Editor from "./Editor";
import Button from "./Button";

interface AppProps {
  editorParams: {
    target: Element;
    anchor?: Element;
  };
  buttonParams: {
    target: Element;
    anchor?: Element;
  };
}
function App({ editorParams, buttonParams }: AppProps) {
  const [editorEl, setEditorEl] = useState<Element | null>(null);
  const [buttonEl, setButtonEl] = useState<Element | null>(null);

  useEffect(() => {
    const el = document.createElement("span");
    if (editorParams.anchor !== undefined) {
      editorParams.target.insertBefore(el, editorParams.anchor);
    } else {
      editorParams.target.appendChild(el);
    }
    setEditorEl(el);
    return () => {
      el.remove();
    };
  }, [editorParams.target, editorParams.anchor]);

  useEffect(() => {
    const el = document.createElement("span");
    if (buttonParams.anchor !== undefined) {
      buttonParams.target.insertBefore(el, buttonParams.anchor);
    } else {
      buttonParams.target.appendChild(el);
    }
    console.log(el);
    setButtonEl(el);
    return () => {
      el.remove();
    };
  }, [buttonParams.target, buttonParams.anchor]);

  if (editorEl === null || buttonEl === null) {
    return null;
  }
  return (
    <>
      {createPortal(<Editor />, editorEl)}
      {createPortal(<Button />, buttonEl)}
    </>
  );
}

export default App;
