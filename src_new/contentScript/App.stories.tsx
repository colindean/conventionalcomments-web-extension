import { useEffect, useRef, useState } from "react";
import type { Meta } from "@storybook/react";
import App from "./App";
import invariant from "tiny-invariant";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "ContentScript",
  component: App,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
} satisfies Meta<typeof App>;

type State =
  | { isReady: false }
  | {
      isReady: true;
      textarea: HTMLTextAreaElement;
      buttonTarget: HTMLDivElement;
    };

const Template = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonTargetRef = useRef<HTMLDivElement>(null);
  console.log(textareaRef.current);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  let state: State = { isReady: false };
  if (isMounted) {
    invariant(textareaRef.current, "Textarea ref must be set");
    invariant(buttonTargetRef.current, "Button target ref must be set");
    state = {
      isReady: true,
      textarea: textareaRef.current,
      buttonTarget: buttonTargetRef.current,
    };
  }

  return (
    <>
      <div ref={buttonTargetRef} />
      {state.isReady ? (
        <App
          productType="github-v1"
          textarea={state.textarea}
          isMainComment
          buttonParams={{ target: state.buttonTarget }}
        />
      ) : null}
      <textarea ref={textareaRef} />
    </>
  );
};

export default meta;
export const Default = Template.bind({});
