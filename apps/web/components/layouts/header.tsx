"use client";

import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import { useIsMobile } from "@workspace/ui/hooks/use-mobile";
import { ThemeToggler } from "@/components/child/theme-toggler";
import { Button } from "@workspace/ui/components/button";

export function Header() {
  const isMobile = useIsMobile();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/appointment", label: "Appointments" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-1 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* <div className="text-2xl font-bold text-primary">🦷</div> */}
          <span className="text-lg font-bold hidden sm:block">Dentora</span>
        </Link>

        {/* --- Navigation Menu --- */}
        <NavigationMenu viewport={isMobile} className="hidden md:flex">
          <NavigationMenuList className="gap-3">
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

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggler />
          <Button variant="ghost" size="sm" asChild className="border">
            <Link href="/login">Log In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Nav (simple dropdown using NavigationMenu) */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggler />

          <NavigationMenu viewport={true}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <NavigationMenuLink asChild>
                          <Link href={link.href}>{link.label}</Link>
                        </NavigationMenuLink>
                      </li>
                    ))}

                    <li className="pt-3 border-t">
                      <NavigationMenuLink asChild>
                        <Link href="/user/login">Log In</Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="/user/signup">Sign Up</Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </nav>
    </header>
  );
}
