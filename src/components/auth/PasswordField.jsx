"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import AuthField from "./AuthField";

export default function PasswordField(props) {
  const [isVisible, setIsVisible] = useState(false);
  const Icon = isVisible ? EyeOff : Eye;

  return (
    <AuthField
      {...props}
      icon={LockKeyhole}
      type={isVisible ? "text" : "password"}
      action={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          <Icon className="size-4" />
        </button>
      }
    />
  );
}
