"use client";
import { memo, useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export type EditTextProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  isSecret?: boolean;
  isMultiline?: boolean;
  className?: string;
};
function EditText({
  className,
  value,
  onChange,
  placeholder,
  isSecret,
  isMultiline,
}: EditTextProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing) inputRef.current?.focus() || textAreaRef.current?.focus();
  }, [isEditing]);

  return (
    <span className={cn("w-full", className)}>
      {isMultiline && isEditing ? (
        <Textarea
          onFocus={() => {
            setIsEditing(true);
          }}
          onBlur={() => setIsEditing(false)}
          onClick={() => setIsEditing(true)}
          ref={textAreaRef}
          value={value}
          placeholder={placeholder}
          readOnly={!isEditing}
          onChange={(e) => onChange?.(e.target.value)}
          className="  overflow-auto focus-visible:ring-0   outline-none shadow-none "
        />
      ) : (
        <Input
          ref={inputRef}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          className={
            "focus-visible:ring-0  border-none outline-none shadow-none"
          }
          value={value}
          onBlur={() => setIsEditing(false)}
          readOnly={!isEditing}
          onClick={() => setIsEditing(true)}
          spellCheck={false}
          onFocus={() => {
            setIsEditing(true);
          }}
          type={isSecret && !isEditing ? "password" : "text"}
        />
      )}
    </span>
  );

  // return (
  //   <span className={cn("w-full flex items-center h-9", className)}>
  //     {isEditing ? (
  //       <Input
  //         ref={inputRef}
  //         placeholder={placeholder}
  //         onChange={(e) => onChange?.(e.target.value)}
  //         className={
  //           "focus-visible:ring-0 border-none outline-none shadow-none p-0 m-0 text-sm h-auto"
  //         }
  //         value={value}
  //         onBlur={() => setIsEditing(false)}
  //       />
  //     ) : (
  //       <span
  //         onClick={() => setIsEditing(true)}
  //         className={cn("text-sm  p-0 m-0 w-full text-left ")}
  //       >
  //         {value}
  //       </span>
  //     )}
  //   </span>
  // );
}

export default memo(EditText);
