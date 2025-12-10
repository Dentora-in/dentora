"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { Button } from "@workspace/ui/components/button";
import { ThemeToggler } from "@/components/child/theme-toggler";
import { useAuthSession } from "@/hooks/get-session";
import { signOut } from "@dentora/auth/client";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export function Header() {
  const { user, session, isLoading } = useAuthSession();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appointment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/contact", label: "Contact Us" },
  ];

  const logoutHandler = async () => {
    await signOut();
    setIsOpen(false);
    router.push("/login");
  };

  if (isLoading) {
    return <div className="h-14 bg-background" />; 
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 mx-auto max-w-7xl h-14">
        {/* --- Logo --- */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">Dentora</span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-1">
            {navLinks.map((link) => (
              <NavigationMenuItem key={link.href}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={link.href}>{link.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* --- Desktop Buttons --- */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggler />
          {user?.name && <p className="text-sm font-medium">{user.name}</p>}
          {session ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={logoutHandler}
              className="border hover:cursor-pointer"
            >
              Log out
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Log In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* --- Mobile Navigation (Sheet/Sidebar) --- */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggler />
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="right">
              <SheetHeader className="text-left border-b pb-4 mb-4">
                <SheetTitle className="font-bold">Dentora</SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col gap-4 px-5">
                {/* Mobile Links */}
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t my-2" />

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-2">
                  {session ? (
                    <div className="flex flex-col gap-2">
                       <p className="text-sm text-muted-foreground">Signed in as {user?.name}</p>
                       <Button onClick={logoutHandler} variant="destructive" className="w-full hover:cursor-pointer">
                         Log out
                       </Button>
                    </div>
                  ) : (
                    <>
                      <Button variant="outline" asChild className="w-full">
                        <Link href="/login" onClick={() => setIsOpen(false)}>Log In</Link>
                      </Button>
                      <Button asChild className="w-full">
                        <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}