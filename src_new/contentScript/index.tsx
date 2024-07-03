import { createRoot } from "react-dom/client";

import commentEditorExtractors from "./commentEditorExtractors";
import App from "./App";
import type { ContentRequestMessage } from "../messageTypes";

console.log("contentScript loaded");
let count = 0;
function getUniqueId(): string {
  count += 1;
  return `comment-editor-${count}`;
}

const noteHolders: Map<
  string,
  {
    // button: Button;
    // editor: Editor;
  }
> = new Map();
const disposeNoteHolder = (id: string): void => {
  if (!noteHolders.has(id)) {
    return;
  }
  const noteHolder = noteHolders.get(id);
  // noteHolder?.button.$destroy();
  // noteHolder?.editor.$destroy();
  noteHolders.delete(id);
};

const disposeFunctions = commentEditorExtractors.map((commentEditorExtractor) =>
  commentEditorExtractor(
    getUniqueId,
    ({
      id,
      textarea,
      isMainComment,
      buttonParams,
      editorParams,
      productType,
    }) => {
      const rootEl = document.createElement("span");
      if (editorParams.anchor !== undefined) {
        editorParams.target.insertBefore(rootEl, editorParams.anchor);
      } else {
        editorParams.target.appendChild(rootEl);
      }
      const root = createRoot(rootEl);
      root.render(
        <App
          productType={productType}
          textarea={textarea}
          isMainComment={isMainComment}
          buttonParams={buttonParams}
        />,
      );
    },
    disposeNoteHolder,
  ),
);

chrome.runtime.onMessage.addListener((message: ContentRequestMessage): void => {
  if (message.type !== "notify-unregister") {
    return;
  }
  noteHolders.forEach((_, key) => {
    disposeNoteHolder(key);
  });
  disposeFunctions.forEach((dispose) => {
    dispose();
  });
});
