"use client";

import { Eye, EyeOff } from "lucide-react";
import { useId, useMemo, useState } from "react";

type PasswordInputProps = Readonly<{
  value: string;
  onValueChange: (next: string) => void;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  ariaLabelShow?: string;
  ariaLabelHide?: string;
}>;

export default function PasswordInput({
  value,
  onValueChange,
  placeholder,
  name,
  autoComplete,
  required,
  disabled,
  className,
  id,
  ariaLabelShow = "Show password",
  ariaLabelHide = "Hide password",
}: PasswordInputProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [visible, setVisible] = useState(false);

  const mergedClassName = useMemo(() => {
    return `${className ?? ""} pr-12`.trim();
  }, [className]);

  return (
    <div className="relative">
      <input
        id={inputId}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        name={name}
        autoComplete={autoComplete}
        value={value}
        onChange={(ev) => onValueChange(ev.target.value)}
        required={required}
        disabled={disabled}
        className={mergedClassName}
      />
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[var(--Text)] hover:bg-black/5 disabled:opacity-50"
        aria-label={visible ? ariaLabelHide : ariaLabelShow}
        onClick={() => setVisible((v) => !v)}
        disabled={disabled}
      >
        {visible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
      </button>
    </div>
  );
}

