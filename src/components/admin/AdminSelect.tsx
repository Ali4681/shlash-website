"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/cn";

export type AdminSelectOption = {
  value: string;
  label: string;
  hint?: string;
};

type Props = {
  name?: string;
  value?: string;
  defaultValue?: string;
  options: AdminSelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  dir?: "rtl" | "ltr";
  onChange?: (value: string) => void;
  className?: string;
};

export function AdminSelect({
  name,
  value,
  defaultValue = "",
  options,
  placeholder = "اختر…",
  required,
  disabled,
  dir,
  onChange,
  className,
}: Props) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [internal, setInternal] = useState(value ?? defaultValue);
  const selected = value ?? internal;

  useEffect(() => {
    if (value != null) setInternal(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = useMemo(
    () => options.find((o) => o.value === selected) ?? null,
    [options, selected],
  );

  const pick = useCallback(
    (next: string) => {
      setInternal(next);
      onChange?.(next);
      setOpen(false);
    },
    [onChange],
  );

  function onTriggerKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div
      ref={rootRef}
      className={cn("admin-select", open && "is-open", disabled && "is-disabled", className)}
      data-admin-select
    >
      {name ? (
        <input
          type="hidden"
          name={name}
          value={selected}
          required={required && !selected}
          readOnly
        />
      ) : null}

      <button
        type="button"
        className="admin-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        dir={dir}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onTriggerKey}
      >
        <span className={cn("admin-select__value", !current && "is-placeholder")}>
          {current ? (
            <>
              <strong>{current.label}</strong>
              {current.hint ? <em>{current.hint}</em> : null}
            </>
          ) : (
            placeholder
          )}
        </span>
        <span className="admin-select__chevron" aria-hidden>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open ? (
        <ul
          id={listId}
          className="admin-select__menu"
          role="listbox"
          aria-activedescendant={selected ? `${listId}-${selected}` : undefined}
        >
          {options.map((opt) => {
            const active = opt.value === selected;
            return (
              <li key={opt.value} role="presentation">
                <button
                  type="button"
                  id={`${listId}-${opt.value}`}
                  role="option"
                  aria-selected={active}
                  className={cn("admin-select__option", active && "is-active")}
                  onClick={() => pick(opt.value)}
                >
                  <span className="admin-select__option-text">
                    <strong>{opt.label}</strong>
                    {opt.hint ? <em>{opt.hint}</em> : null}
                  </span>
                  {active ? (
                    <span className="admin-select__check" aria-hidden>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
                        <path
                          d="M5 12.5 10 17.5 19 7.5"
                          stroke="currentColor"
                          strokeWidth="2.1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
