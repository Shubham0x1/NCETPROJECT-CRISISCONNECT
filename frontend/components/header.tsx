"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image" // <-- CHANGED: Import the Image component
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Home, Plus, MapPin, Users, User, LogOut } from "lucide-react" // <-- CHANGED: Removed Shield icon
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Report", href: "/report", icon: Plus },
  { name: "Nearby", href: "/nearby", icon: MapPin },
  { name: "My Contributions", href: "/contributions", icon: Users },
  { name: "Profile", href: "/profile", icon: User },
]

export function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("userData")

      if (authStatus === "true" && userData) {
        setIsAuthenticated(true)
        const user = JSON.parse(userData)
        setUserName(user.name || "User")
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userData")
    window.location.reload()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            {/* --- THIS IS THE UPDATED LOGO --- */}
            <Image
              src="/logo.png"
              alt="CrisisConnect Logo"
              width={32}
              height={32}
            />
            {/* --- END OF UPDATE --- */}
            <span className="text-xl font-bold text-foreground">CrisisConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}

            {isAuthenticated && (
              <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-border">
                <span className="text-sm text-muted-foreground">Welcome, {userName}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}

                {isAuthenticated && (
                  <>
                    <div className="border-t border-border pt-4 mt-4">
                      <div className="px-3 py-2 text-sm text-muted-foreground">Welcome, {userName}</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full justify-start text-muted-foreground hover:text-foreground mt-2"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}