import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";
import Editor from "./Editor";
import Button from "./Button";
import { ProductType } from "../types";
import extractComment from "../helper/extractComment";
import { DECORATIONS, LABELS } from "./constants";
import useTextareaWrapper from "./useTextareaWrapper";

interface AppProps {
  productType: ProductType;
  textarea: HTMLTextAreaElement;
  isMainComment: boolean;
  buttonParams: {
    target: Element;
    anchor?: Element;
  };
}
function App({ productType, textarea, isMainComment, buttonParams }: AppProps) {
  const [buttonEl, setButtonEl] = useState<Element | null>(null);
  const [{ isActive, label, decorations }, setState] = useState<{
    isActive: boolean;
    label: string;
    decorations: string[];
  }>(() => {
    const initialComment = extractComment(
      textarea.value,
      LABELS.map(({ value }) => value),
      DECORATIONS.map(({ value }) => value),
    );

    return {
      isActive:
        initialComment !== null || (textarea.value === "" && isMainComment),
      label: initialComment?.label ?? LABELS[0].label,
      decorations: initialComment?.decorations ?? [],
    };
  });

  useEffect(() => {
    if (isActive) {
      const initialComment = extractComment(
        textarea.value,
        LABELS.map(({ value }) => value),
        DECORATIONS.map(({ value }) => value),
      );

      if (initialComment === null) {
        setState({ isActive: true, label: LABELS[0].label, decorations: [] });
        return;
      }

      const initialLabel = LABELS.find(
        ({ value }) => value === initialComment.label,
      );
      invariant(
        initialLabel !== undefined,
        "Extracted label must correspond to an existing label",
      );

      const initialDecorations = initialComment.decorations.map(
        (decorationValue) => {
          const matchingDecoration = DECORATIONS.find(
            ({ value }) => value === decorationValue,
          );
          invariant(
            matchingDecoration !== undefined,
            "Extracted decoration must correspond to an existing decoration",
          );
          return matchingDecoration.label;
        },
      );
      setState({
        isActive: true,
        label: initialLabel.label,
        decorations: initialDecorations,
      });
    }
  }, [textarea, isActive]);

  const activeLabel = LABELS.find(
    (currentLabel) => currentLabel.label === label,
  );
  invariant(activeLabel !== undefined, "Current label must exist");
  const currentLabelValue = activeLabel.value;
  const currentDecorationValues = decorations.map((decoration) => {
    const currentDecoration = DECORATIONS.find(
      ({ label }) => label === decoration,
    );
    invariant(currentDecoration !== undefined, "Current decoration must exist");
    return currentDecoration.value;
  });

  useEffect(() => {
    const el = document.createElement("span");

    if (buttonParams.anchor !== undefined) {
      buttonParams.target.insertBefore(el, buttonParams.anchor);
    } else {
      buttonParams.target.appendChild(el);
    }
    setButtonEl(el);
    return () => {
      el.remove();
    };
  }, [productType, buttonParams.target, buttonParams.anchor]);

  useTextareaWrapper(
    textarea,
    isActive,
    currentLabelValue,
    currentDecorationValues,
  );

  if (buttonEl === null) {
    return null;
  }

  function onToggleIsActive() {
    setState((prev) => ({ ...prev, isActive: !prev.isActive }));
  }

  function onSelectLabel(label: string) {
    setState((prev) => ({ ...prev, label }));
  }

  function onToggleDecoration(decoration: string) {
    setState((prev) => ({
      ...prev,
      decorations: prev.decorations.includes(decoration)
        ? prev.decorations.filter((d) => d !== decoration)
        : [...prev.decorations, decoration],
    }));
  }

  return (
    <>
      {createPortal(
        <Button
          productType={productType}
          isActive={isActive}
          onToggle={onToggleIsActive}
        />,
        buttonEl,
      )}
      {isActive ? (
        <Editor
          label={label}
          decorations={decorations}
          onSelectLabel={onSelectLabel}
          onToggleDecoration={onToggleDecoration}
        />
      ) : null}
    </>
  );
}

export default App;
