import { DECORATIONS, LABELS } from "./constants";

interface EditorProps {
  label: string;
  decorations: string[];
  onSelectLabel: (label: string) => void;
  onToggleDecoration: (decoration: string) => void;
}

function Editor({
  label,
  decorations,
  onSelectLabel,
  onToggleDecoration,
}: EditorProps) {
  return (
    <div
      data-testid="editor"
      data-testlabel={label}
      data-testdecorations={decorations.join(", ")}
    >
      <select
        data-testid="label-selector"
        value={label}
        onChange={(e) => onSelectLabel(e.target.value)}
      >
        {LABELS.map(({ value, label }) => (
          <option key={label} value={label}>
            {value}
          </option>
        ))}
      </select>
      {DECORATIONS.map(({ value, label }) => (
        <label key={label}>
          <input
            data-testid={`decoration-${label}`}
            type="checkbox"
            checked={decorations.includes(label)}
            value={label}
            onChange={() => onToggleDecoration(label)}
          />
          {value}
        </label>
      ))}
    </div>
  );
}

export default Editor;
