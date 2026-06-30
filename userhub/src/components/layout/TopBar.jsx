import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLocation } from "react-router-dom";

const TITLES = {
  "/":      "Overview",
  "/users": "People",
  "/add":   "Add person",
};

export default function TopBar({ onMenuClick }) {
  const { dark, toggle } = useTheme();
  const { pathname }     = useLocation();

  const title =
    TITLES[pathname] ||
    (pathname.startsWith("/edit/") ? "Edit person" :
     pathname.startsWith("/user/") ? "Profile" : "UserHub");

  return (
    <header
      className="
        fixed top-0 left-0 right-0 lg:left-56 z-20 h-14
        flex items-center justify-between px-4 sm:px-6
        bg-white/90 dark:bg-ink-950/90 backdrop-blur-md
        border-b border-ink-100 dark:border-ink-900
      "
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="btn-ghost btn-icon lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={16} />
        </button>
        <h1 className="text-[13px] font-semibold text-ink-800 dark:text-ink-200">
          {title}
        </h1>
      </div>

      <button
        onClick={toggle}
        className="btn-ghost btn-icon"
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {dark
          ? <Sun size={15} className="text-ink-400" />
          : <Moon size={15} className="text-ink-400" />
        }
      </button>
    </header>
  );
}
