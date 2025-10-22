import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@lib/redux/store";
import { Icon } from "@iconify/react";

// ✅ Map of flags by language_code
const flagMap: Record<string, React.ReactNode> = {

  en: (
   <Icon icon="flag:gb-4x3" width="22" height="22" />
  ),
  ar: (
   <Icon icon="flag:sa-4x3" width="22" height="22" />
  ),
  tr: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-6 rounded-md">
      <path fill="#e30a17" d="M0 0h640v480H0z" />
      <circle cx="220" cy="240" r="80" fill="#fff" />
      <circle cx="240" cy="240" r="65" fill="#e30a17" />
      <path fill="#fff" d="M280 240l61 19-38-53v66l38-53-61 19z" />
    </svg>
  ),
  ru: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-6 rounded-md">
      <path fill="#fff" d="M0 0h640v160H0z" />
      <path fill="#0039a6" d="M0 160h640v160H0z" />
      <path fill="#d52b1e" d="M0 320h640v160H0z" />
    </svg>
  ),
  fr: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" className="w-6 h-6 rounded-md">
      <path fill="#0055a4" d="M0 0h213v480H0z" />
      <path fill="#fff" d="M213 0h214v480H213z" />
      <path fill="#ef4135" d="M427 0h213v480H427z" />
    </svg>
  ),
  ch: (
  <Icon icon="flag:cn-4x3" width="22" height="22" />
  ),
  ge: (
   <Icon icon="flag:de-4x3" width="22" height="22" />
  ),
};

export default function LanguageDropdown() {
  const [selected, setSelected] = useState<string>("en");
  const [open, setOpen] = useState(false);
  const { languages } = useAppSelector((state) => state.appData?.data);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = languages?.find((l: any) => l.language_code === selected);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      {/* Custom Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className=" relative flex items-center cursor-pointer w-24 justify-between  px-4 py-2 bg-white dark:bg-gray-900  border-gray-300 dark:border-gray-700   text-sm font-medium text-gray-700 dark:text-gray-200  dark:hover:bg-gray-800"
      >
        <span className="flex items-center gap-2">
          {/* {flagMap[selected] ?? <span className="w-6 h-6 rounded-md bg-gray-300" />} */}
          {selectedLang?.name}
        </span>
        <svg
          className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute bottom-10 z-10 w-40 md:w-60 p-2 space-y-2 font-helvetica mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {languages?.map((lang: any) => (
            <button
              key={lang.id}
              onClick={() => {
                setSelected(lang.language_code);
                setOpen(false);
              }}
              className={`flex rounded-md items-center cursor-pointer gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selected === lang.language_code ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              {flagMap[lang.language_code] ?? <span className="w-6 h-6 rounded-md bg-gray-300" />}
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
