import type { CSSProperties } from "react";
import { ProductType } from "../types";

function getButtonClasses(productType: ProductType): string[] {
  switch (productType) {
    case "github-v1":
      return [
        "flex-auto",
        "text-center",
        "toolbar-item",
        "btn-octicon",
        "p-2",
        "p-md-1",
        "mx-1",
      ];
    case "github-v2":
      return [
        "flex-auto",
        "text-center",
        "toolbar-item",
        "btn-octicon",
        "p-2",
        "mx-0",
      ];
    case "gitlab-v1":
      return [
        "btn",
        "gl-mr-2",
        "btn-default",
        "btn-sm",
        "gl-button",
        "btn-default-tertiary",
        "btn-icon",
      ];
    case "gitlab-v2":
      return [
        "btn",
        "gl-mr-2",
        "btn-default",
        "btn-sm",
        "gl-button",
        "btn-default-tertiary",
        "btn-icon",
      ];
  }
}

function getButtonStyle(
  productType: ProductType,
  isActive: boolean,
): CSSProperties {
  return isActive ? { fill: "red" } : { fill: "currentcolor" };
}

function getIconClasses(productType: ProductType): string[] {
  switch (productType) {
    case "github-v1":
      return ["octicon"];
    case "github-v2":
      return ["octicon"];
    case "gitlab-v1":
      return ["gl-button-icon", "gl-icon", "s16"];
    case "gitlab-v2":
      return ["gl-button-icon", "gl-icon", "s16"];
  }
}

interface ButtonProps {
  productType: ProductType;
  isActive: boolean;
  onToggle: () => void;
}

function Button({ productType, isActive, onToggle }: ButtonProps) {
  const buttonClasses = getButtonClasses(productType);
  const iconClasses = getIconClasses(productType);
  return (
    <span className={buttonClasses.join(" ")} onClick={() => onToggle()}>
      <svg
        className={iconClasses.join(" ")}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={getButtonStyle(productType, isActive)}
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 16V2L2 0H14L16 2V13L14 15H4L0 16ZM2 3L3 2H13L14 3V12L13 13H2V3Z"
        />
        <circle cx="8" cy="5.5" r="1.5" />
        <circle cx="8" cy="9.5" r="1.5" />
      </svg>
    </span>
  );
}

export default Button;
