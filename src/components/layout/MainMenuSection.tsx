'use client';
import { Component, Home, MapPlus, MountainSnow } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '../ui/sidebar';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type MenuItem = {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
};

const menuItems: MenuItem[] = [
  {
    label: 'Home',
    href: '/',
    icon: Home
  },
  {
    label: 'Explore',
    href: '/explore',
    icon: MapPlus
  },
  {
    label: 'Hiking Groups',
    href: '/groups',
    icon: Component
  },
  {
    label: 'Mountains',
    href: '/mountains',
    icon: MountainSnow
  }
];

export default function MainMenuSection() {
  const pathname = usePathname();
  const currentPath = '/' + pathname.split('/')[1];

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                tooltip={item.label}
                isActive={currentPath === item.href}
                size="lg"
                asChild
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
