import { Home, Folder, Settings } from "lucide-react"
import type { SidebarNavNode } from "@/components/sidebar/sidebar-nav-item"

export const navMain: SidebarNavNode[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Projects",
    icon: Folder,
    items: [
      {
        title: "Frontend",
        items: [
          { title: "Web App", url: "/projects/frontend/web-app" },
          { title: "Landing Page", url: "/projects/frontend/landing-page" },
        ],
      },
      {
        title: "Backend",
        items: [
          { title: "API", url: "/projects/backend/api" },
          { title: "Workers", url: "/projects/backend/workers" },
        ],
      },
      {
        title: "All Projects",
        url: "/projects",
      },
    ],
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]