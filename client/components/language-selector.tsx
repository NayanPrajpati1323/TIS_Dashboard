import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const languages = [
  { code: "in", flag: "/flag/India.png" },
  { code: "uk", flag: "/flag/uk.png" },
  { code: "ru", flag: "/flag/Russia.png" },
]

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])

  const handleLanguageChange = (language: typeof languages[0]) => {
    setSelectedLanguage(language)
    localStorage.setItem("selectedLanguage", language.code)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 px-2 gap-1">
          <img src={selectedLanguage.flag} alt="flag" className="w-5 h-5 rounded-sm" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[80px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className={`flex items-center justify-center cursor-pointer ${
              selectedLanguage.code === language.code ? "bg-accent" : ""
            }`}
          >
            <img src={language.flag} alt="flag" className="w-5 h-5 rounded-sm" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
