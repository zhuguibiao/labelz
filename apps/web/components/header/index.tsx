"use client";

import Link from "next/link";
import { Button } from "@labelz/ui/components/button";

import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { ChevronLeft, Github } from "lucide-react";
import { useI18n } from "../i18n-provider";

interface AnnotationHeaderProps {
  type?: string;
  showBack?: boolean;
}

export function AnnotationHeader({
  type,
  showBack = true,
}: AnnotationHeaderProps) {
  const { t } = useI18n();

  const getTypeIcon = () => {
    switch (type) {
      case "image":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
        );
      case "video":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="m22 8-6 4 6 4V8Z" />
            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
          </svg>
        );
      case "audio":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" x2="12" y1="19" y2="22" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-14 items-center px-4">
        {showBack && (
          <Link href="/" className="flex items-center mr-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span> {t("back_to_home")}</span>
          </Link>
        )}

        <div className="flex-1 flex items-center gap-2">
          {getTypeIcon()}
          <h1 className="text-lg font-semibold capitalize">
            {type} {t("annotation")}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          <LanguageToggle />
          <Button variant="ghost" size="icon" asChild>
            <a
              href="https://github.com/zhuguibiao/labelz"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
