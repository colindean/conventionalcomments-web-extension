import { useEffect, useRef } from "react";
import detectModification from "../helper/detectModification";
import formatComment from "../helper/formatComment";
import extractComment from "../helper/extractComment";
import { DECORATIONS, LABELS } from "./constants";

const EVENTS = ["select", "click", "focus", "keyup", "keydown"] as const;

function useTextareaWrapper(
  textarea: HTMLTextAreaElement,
  isActive: boolean,
  label: string,
  decorations: string[],
) {
  const prependedText = useRef(formatComment(label, decorations));
  useEffect(() => {
    prependedText.current = formatComment(label, decorations);
    if (isActive) {
      const currentComment = extractComment(
        textarea.value,
        LABELS.map(({ value }) => value),
        DECORATIONS.map(({ value }) => value),
      );

      const previousCommentLength = currentComment?.totalLength ?? 0;
      const selectionShift =
        prependedText.current.length - previousCommentLength;
      const newSelectionStart = textarea.selectionStart + selectionShift;
      const newSelectionEnd = textarea.selectionEnd + selectionShift;
      const newSelectionDirection = textarea.selectionDirection;

      textarea.value =
        prependedText.current + textarea.value.substring(previousCommentLength);
      textarea.dispatchEvent(new Event("change"));
      textarea.setSelectionRange(
        newSelectionStart,
        newSelectionEnd,
        newSelectionDirection,
      );
    }
    setTimeout(() => {
      textarea.focus();
    }, 0);
  }, [textarea, isActive, label, decorations]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    function updateTexareaSelection() {
      const maxSelection = prependedText.current.length;
      if (
        textarea.selectionStart < maxSelection ||
        textarea.selectionEnd < maxSelection
      ) {
        textarea.setSelectionRange(
          Math.max(textarea.selectionStart, maxSelection),
          Math.max(textarea.selectionEnd, maxSelection),
          textarea.selectionDirection,
        );
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Backspace") {
        return;
      }

      const maxSelection = prependedText.current.length;
      if (
        textarea.selectionStart === maxSelection &&
        textarea.selectionEnd === maxSelection
      ) {
        event.preventDefault();
      }
    }

    function forceComment() {
      const newValue = detectModification(
        prependedText.current,
        textarea.value,
      );

      if (newValue === null) {
        return;
      }

      textarea.value = newValue;
      const event = new Event("change");
      textarea.dispatchEvent(event);
    }

    EVENTS.forEach((eventName) => {
      textarea.addEventListener(eventName, updateTexareaSelection);
    });
    textarea.addEventListener("keydown", onKeyDown);
    textarea.addEventListener("input", forceComment);
    textarea.addEventListener("focus", forceComment);
    return () => {
      EVENTS.forEach((eventName) => {
        textarea.removeEventListener(eventName, updateTexareaSelection);
      });
      textarea.removeEventListener("keydown", onKeyDown);
      textarea.removeEventListener("input", forceComment);
      textarea.removeEventListener("focus", forceComment);
    };
  }, [textarea, isActive]);
}

export default useTextareaWrapper;
