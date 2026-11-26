import React, { forwardRef, useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/cn";
import { ModernTooltip } from "./modern-tooltip";

export interface TactileSelectOption {
  value: string;
  label: string;
  description?: string;
  tooltip?: string;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TactileSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  tooltip?: string;
  leftIcon?: React.ReactNode;
  selectSize?: "sm" | "md" | "lg";
  variant?: "default" | "parchment" | "subtle" | "ghost" | "dark";
  options?: TactileSelectOption[];
  containerClassName?: string;
  showSelectedDescription?: boolean;
  mode?: "auto" | "native" | "custom";
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
}

export const TactileSelect = forwardRef<HTMLSelectElement, TactileSelectProps>(
  (
    {
      label,
      placeholder = "-- Chọn --",
      error,
      hint,
      tooltip,
      leftIcon,
      selectSize = "md",
      variant = "default",
      options,
      children,
      className,
      containerClassName,
      id,
      disabled,
      value,
      defaultValue,
      onChange,
      onValueChange,
      showSelectedDescription = true,
      mode = "auto",
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || (label ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : generatedId);
    const hintId = hint ? `${selectId}-hint` : undefined;
    const errorId = error ? `${selectId}-error` : undefined;

    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState<string>(
      (value !== undefined ? value : defaultValue !== undefined ? defaultValue : "") as string
    );
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    // Keep internalValue in sync with controlled value prop
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    // Determine if custom popover mode should be used
    const hasRichMetadata = Boolean(
      options &&
        options.some(
          (opt) => Boolean(opt.description || opt.tooltip || opt.badge || opt.icon)
        )
    );
    const isCustomMode =
      mode === "custom" || (mode === "auto" && Boolean(options) && hasRichMetadata);

    // Close on click outside
    useEffect(() => {
      if (!isCustomMode || !isOpen) return;

      const handleClickOutside = (e: MouseEvent | TouchEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchstart", handleClickOutside);
      };
    }, [isCustomMode, isOpen]);

    // Handle selection in custom mode
    const handleSelectOption = (opt: TactileSelectOption) => {
      if (opt.disabled) return;
      setInternalValue(opt.value);
      setIsOpen(false);

      if (onValueChange) {
        onValueChange(opt.value);
      }

      if (onChange) {
        // Create synthetic event for backward compatibility with standard forms
        const syntheticEvent = {
          target: { value: opt.value, name: props.name || selectId },
          currentTarget: { value: opt.value, name: props.name || selectId },
          persist: () => {},
        } as unknown as React.ChangeEvent<HTMLSelectElement>;
        onChange(syntheticEvent);
      }
    };

    const selectedOption = options?.find((o) => o.value === internalValue);

    const sizeClasses = {
      sm: "min-h-[40px] text-xs py-2 px-3 pr-8.5 rounded-lg",
      md: "min-h-[48px] text-xs sm:text-sm py-2.5 px-4 pr-10 rounded-xl",
      lg: "min-h-[52px] text-sm sm:text-base py-3.5 px-4 pr-10 rounded-xl",
    };

    const variantClasses = {
      default:
        "bg-white text-slate-900 border border-amber-200/90 shadow-2xs focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20",
      parchment:
        "bg-[#FBF9F5] text-slate-900 border border-amber-200/90 shadow-2xs focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20",
      subtle:
        "bg-amber-50/70 text-slate-800 border border-amber-200/80 hover:bg-amber-100/50 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20",
      ghost:
        "bg-transparent text-slate-800 border border-transparent hover:bg-amber-100/40 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20",
      dark:
        "bg-indigo-950/80 text-amber-100 border border-amber-400/30 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20",
    };

    const caretColorClasses = {
      default: "text-amber-800",
      parchment: "text-amber-800",
      subtle: "text-amber-900",
      ghost: "text-slate-600",
      dark: "text-amber-300",
    };

    return (
      <div
        ref={containerRef}
        className={cn("flex flex-col gap-1.5 w-full relative", containerClassName)}
      >
        {label && (
          <div className={cn("flex items-center justify-between text-xs font-semibold tracking-wide font-sans", variant === "dark" ? "text-slate-200" : "text-slate-800")}>
            <div className="flex items-center gap-1.5">
              <label htmlFor={selectId} className="cursor-pointer">
                {label}
              </label>
              {tooltip && (
                <ModernTooltip content={tooltip} side="top">
                  <span
                    className="inline-flex items-center justify-center text-amber-800/80 hover:text-primary-700 cursor-help transition-colors"
                    title={tooltip}
                  >
                    <Info className="w-3.5 h-3.5" />
                  </span>
                </ModernTooltip>
              )}
            </div>
            {hint && (
              <span id={hintId} className="text-xs text-slate-500 font-normal">
                {hint}
              </span>
            )}
          </div>
        )}

        <div className="relative w-full">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 flex items-center justify-center z-10">
              {leftIcon}
            </div>
          )}

          {isCustomMode && options ? (
            /* =========================================================================
               CUSTOM MODERN DROPDOWN MODE (Rich Option Tooltips, Badges & Subtitles)
               ========================================================================= */
            <>
              <button
                type="button"
                id={selectId}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsOpen(false);
                  if (e.key === "ArrowDown" && !isOpen) {
                    e.preventDefault();
                    setIsOpen(true);
                  }
                }}
                className={cn(
                  "w-full text-left font-medium outline-none transition-all duration-200 cursor-pointer flex items-center justify-between",
                  sizeClasses[selectSize],
                  variantClasses[variant],
                  leftIcon && (selectSize === "sm" ? "pl-9" : "pl-10"),
                  isOpen && "border-primary-600 ring-2 ring-primary-500/20",
                  disabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400",
                  error && "border-rose-400 focus:border-rose-500 focus:ring-rose-400/20",
                  className
                )}
              >
                <div className="flex items-center gap-2 truncate pr-2">
                  {selectedOption?.icon && (
                    <span className="shrink-0">{selectedOption.icon}</span>
                  )}
                  <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                  </span>
                  {selectedOption?.badge && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 shrink-0">
                      {selectedOption.badge}
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    "shrink-0 flex items-center justify-center transition-transform duration-200",
                    caretColorClasses[variant],
                    isOpen && "rotate-180",
                    disabled && "opacity-40"
                  )}
                >
                  <ChevronDown className={cn(selectSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />
                </div>
              </button>

              {/* Floating Popover Listbox */}
              {isOpen && (
                <div
                  role="listbox"
                  className={cn(
                    "absolute right-0 z-50 mt-1.5",
                    options.some((o) => o.description)
                      ? "left-0 p-1.5 rounded-2xl max-h-80 space-y-1 w-full"
                      : "min-w-full sm:min-w-[105px] p-1 rounded-xl max-h-60 space-y-0.5",
                    "bg-white/98 backdrop-blur-md shadow-2xl",
                    "border border-amber-200/90 overflow-y-auto no-scrollbar",
                    "animate-in fade-in-0 zoom-in-95 duration-150"
                  )}
                >
                  {options.map((opt) => {
                    const isSelected = opt.value === internalValue;
                    const hasDesc = Boolean(opt.description);

                    const optionContent = (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectOption(opt)}
                        className={cn(
                          "group/opt relative cursor-pointer transition-all duration-150 flex select-none",
                          hasDesc ? "p-2.5 rounded-xl items-start gap-2.5" : "p-2 rounded-lg items-center gap-2",
                          opt.disabled && "opacity-50 cursor-not-allowed",
                          isSelected
                            ? "bg-amber-100/70 border border-amber-300/80 shadow-2xs text-slate-900"
                            : "hover:bg-amber-50/80 border border-transparent text-slate-800"
                        )}
                      >
                        {opt.icon && (
                          hasDesc ? (
                            <div
                              className={cn(
                                "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                                isSelected
                                  ? "bg-primary-600 text-white"
                                  : "bg-amber-100 text-amber-800 group-hover/opt:bg-amber-200/80"
                              )}
                            >
                              {opt.icon}
                            </div>
                          ) : (
                            <span className="shrink-0 flex items-center justify-center text-sm">
                              {opt.icon}
                            </span>
                          )
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1.5">
                            <span
                              className={cn(
                                "text-xs font-semibold tracking-tight",
                                isSelected ? "text-primary-950 font-bold" : "text-slate-900"
                              )}
                            >
                              {opt.label}
                            </span>
                            <div className="flex items-center gap-1.5 shrink-0">
                              {opt.badge && (
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-amber-100/90 text-amber-900 border border-amber-300/80">
                                  {opt.badge}
                                </span>
                              )}
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-primary-700" />
                              )}
                            </div>
                          </div>

                          {opt.description && (
                            <p className="text-xs text-slate-600 font-sans mt-0.5 leading-snug line-clamp-2">
                              {opt.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );

                    // If option has an explicit tooltip, wrap it with ModernTooltip
                    if (opt.tooltip) {
                      return (
                        <ModernTooltip
                          key={opt.value}
                          content={opt.tooltip}
                          side="right"
                          className="w-64"
                        >
                          {optionContent}
                        </ModernTooltip>
                      );
                    }

                    return optionContent;
                  })}
                </div>
              )}
            </>
          ) : (
            /* =========================================================================
               STANDARD NATIVE SELECT MODE (Clean Appearance-None with Caret)
               ========================================================================= */
            <>
              <select
                ref={(node) => {
                  selectRef.current = node;
                  if (typeof ref === "function") {
                    ref(node);
                  } else if (ref) {
                    ref.current = node;
                  }
                }}
                id={selectId}
                disabled={disabled}
                value={value !== undefined ? value : internalValue}
                onChange={(e) => {
                  setInternalValue(e.target.value);
                  if (onChange) onChange(e);
                  if (onValueChange) onValueChange(e.target.value);
                }}
                aria-invalid={!!error}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={cn(
                  "w-full appearance-none cursor-pointer font-medium outline-none transition-all duration-200",
                  sizeClasses[selectSize],
                  variantClasses[variant],
                  leftIcon && (selectSize === "sm" ? "pl-9" : "pl-10"),
                  disabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400",
                  error && "border-rose-400 focus:border-rose-500 focus:ring-rose-400/20",
                  className
                )}
                {...props}
              >
                {options
                  ? options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        disabled={opt.disabled}
                        title={opt.tooltip || opt.description}
                        className={
                          variant === "dark"
                            ? "bg-slate-900 text-white"
                            : "bg-white text-slate-900"
                        }
                      >
                        {opt.label}
                      </option>
                    ))
                  : children}
              </select>

              <div
                className={cn(
                  "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center transition-transform",
                  caretColorClasses[variant],
                  disabled && "opacity-40"
                )}
              >
                <ChevronDown className={cn(selectSize === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")} />
              </div>
            </>
          )}
        </div>

        {/* Selected Option Description Pill / Subtitle */}
        {showSelectedDescription && selectedOption?.description && !isCustomMode && (
          <div className="text-xs text-slate-600 font-sans italic pl-1 flex items-start gap-1.5 mt-0.5">
            <Sparkles className="w-3.5 h-3.5 text-primary-700 shrink-0 mt-0.5" />
            <span className="leading-snug">{selectedOption.description}</span>
          </div>
        )}

        {error && (
          <span id={errorId} className="text-xs font-medium text-rose-600 mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

TactileSelect.displayName = "TactileSelect";
