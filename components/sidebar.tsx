"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, FileText, Star, Archive, Trash2, Settings, LogOut, Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const { setTheme } = useTheme()

  const navItems = [
    { href: "/app/notes", icon: <FileText className="h-5 w-5" />, label: "All Notes" },
    { href: "/app/favorites", icon: <Star className="h-5 w-5" />, label: "Favorites" },
    { href: "/app/archive", icon: <Archive className="h-5 w-5" />, label: "Archive" },
    { href: "/app/trash", icon: <Trash2 className="h-5 w-5" />, label: "Trash" },
  ]

  return (
    <div className={`border-r bg-muted/40 flex flex-col ${isCollapsed ? "w-16" : "w-64"} transition-all duration-300`}>
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <span className="font-bold text-xl">NoteSync</span>}
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      <div className="p-2">
        <Button className="w-full justify-start gap-2" size={isCollapsed ? "icon" : "default"}>
          <Plus className="h-5 w-5" />
          {!isCollapsed && "New Note"}
        </Button>
      </div>

      {!isCollapsed && (
        <div className="p-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search notes..." className="pl-8" />
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-2 ${isCollapsed ? "px-2" : ""}`}
                  size={isCollapsed ? "icon" : "default"}
                >
                  {item.icon}
                  {!isCollapsed && item.label}
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 mt-auto border-t">
        <div className="flex items-center justify-between mb-2">
          {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Link href="/app/settings">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>

          {!isCollapsed && (
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className={`flex items-center gap-2 ${isCollapsed ? "justify-center" : ""}`}>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-medium">John Doe</span>
              <span className="text-xs text-muted-foreground">john@example.com</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

