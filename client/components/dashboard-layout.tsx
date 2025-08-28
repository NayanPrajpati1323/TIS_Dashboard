import { Children, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Globe,
  ShoppingCart,
  MessageSquare,
  Phone,
  Calendar,
  Mail,
  CheckSquare,
  StickyNote,
  Share2,
  FolderOpen,
  Kanban,
  UserCheck,
  FileText,
  Search,
  Settings,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Tag,
  Ruler,
  Plus,
  Eye,
  RefreshCw,
  User,
  Bell,
  Home,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTheme } from "./theme-provider";
import { NotificationPopup } from "./notification-popup";
import { LanguageSelector } from "./language-selector";
import { SidebarSubSidebar } from "@/components/ui/sidebar";

interface NavigationItem {
  title: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    title: "Main",
    icon: LayoutDashboard,
    children: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        // children: [
        //   { title: "Dashboard", href: "/", icon: LayoutDashboard },
        //   {
        //     title: "Admin Dashboard",
        //     href: "/admin-dashboard",
        //     icon: LayoutDashboard,
        //   },
        //   {
        //     title: "Admin Dashboard 2",
        //     href: "/admin-dashboard-2",
        //     icon: LayoutDashboard,
        //   },
        //   {
        //     title: "Customer Dashboard",
        //     href: "/customer-dashboard",
        //     icon: LayoutDashboard,
        //   },
        //   {
        //     title: "Super Admin Dashboard",
        //     href: "/super-admin-dashboard",
        //     icon: LayoutDashboard,
        //   },
        // ],
      },
      // {
      //   title: "Super Admin",
      //   icon: User,
      //   children: [
      //     { title: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
      //     { title: "Companies", href: "/super-admin/companies", icon: Users },
      //     {
      //       title: "Subscriptions",
      //       href: "/super-admin/subscriptions",
      //       icon: Package,
      //     },
      //     { title: "Packages", href: "/super-admin/packages", icon: Package },
      //     { title: "Domain", href: "/super-admin/domain", icon: Globe },
      //     {
      //       title: "Purchase Transaction",
      //       href: "/super-admin/transactions",
      //       icon: ShoppingCart,
      //     },
      //   ],
      // },
      // {
      //   title: "Frontend",
      //   icon: Monitor,
      //   children: [],
      // },
      // {
      //   title: "Applications",
      //   icon: LayoutDashboard,
      //   children: [
      //     { title: "Chat", href: "/app/chat", icon: MessageSquare },
      //     {
      //       title: "Calls",
      //       icon: Phone,
      //       children: [
      //         { title: "Voice Call", href: "/app/calls/voice", icon: Phone },
      //         { title: "Video Call", href: "/app/calls/video", icon: Phone },
      //         {
      //           title: "Outgoing Call",
      //           href: "/app/calls/outgoing",
      //           icon: Phone,
      //         },
      //         {
      //           title: "Incoming Call",
      //           href: "/app/calls/incoming",
      //           icon: Phone,
      //         },
      //         {
      //           title: "Call History",
      //           href: "/app/calls/history",
      //           icon: Phone,
      //         },
      //       ],
      //     },
      //     { title: "Calendar", href: "/app/calendar", icon: Calendar },
      //     { title: "Email", href: "/app/email", icon: Mail },
      //     { title: "To Do", href: "/app/todo", icon: CheckSquare },
      //     { title: "Notes", href: "/app/notes", icon: StickyNote },
      //     { title: "Social Feed", href: "/app/social", icon: Share2 },
      //     { title: "File Manager", href: "/app/files", icon: FolderOpen },
      //     { title: "Kanban", href: "/app/kanban", icon: Kanban },
      //     { title: "Contacts", href: "/app/contacts", icon: UserCheck },
      //     { title: "Invoices", href: "/app/invoices", icon: FileText },
      //     { title: "Search List", href: "/app/search", icon: Search },
      //   ],
      // },
    ],
  },
  {
    title: "Inventory & Sales",
    icon: Package,
    children: [
      {
        title: "Product",
        icon: Package,
        children: [
          { title: "Products", href: "/inventory/products", icon: Package },
          { title: "Category", href: "/inventory/categories", icon: Tag },
          { title: "Units", href: "/inventory/units", icon: Ruler },
        ],
      },
      // {title: "Inventory", href: "/inventory", icon: Package },
      {
        title: "Invoice",
        icon: FileText,
        children: [
          { title: "Invoice", href: "/invoices", icon: FileText },
          { title: "Create Invoice", href: "/invoices/create", icon: Plus },
          { title: "Invoice Details", href: "/invoices/details", icon: Eye },
          // { title: "Invoice Templates",href: "/invoices/templates", icon: FileText, },
          // {title: "Recurring Invoice", href: "/invoices/recurring",icon: RefreshCw,},
        ],
      },
      // { title: "Credit Notes", href: "/credit-notes", icon: FileText },
      { title: "Quotations", href: "/quotations", icon: FileText },
      // {title: "Delivery Challans", href: "/delivery-challans",icon: FileText, },
      {
        title: "Customers",
        icon: UserCheck,
        href: "/customers",
        // children: [
        //   { title: "Customer", href: "/customers", icon: Users },
        //   { title: "Customer Details", href: "/customers/details", icon: User },
        // ],
      },
    ],
  },
  // {
  //   title: "Purchases",
  //   icon: Package,
  //   children: [
  //     { title: "Purchases", href: "/client/pages/Purchases.tsx",icon: Package,},
  //     { title: "Purchase Order", href: "/client/pages/Purchases-order.tsx" , icon: Package},
  //     { title: "Debit Notes", href: "/inventory", icon: Package },
  //     { title: "Supplier",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "Supplier Payments", href: "/Supplier-Payments", icon: FileText },
  //   ],
  // },
  {
    title: "Finance & Accounts",
    icon: Package,
    children: [
      { title: "Expenses", href: "/client/pages/Purchases.tsx", icon: Package },
      // {
      //   title: "Incomes",
      //   href: "/client/pages/Purchases-order.tsx",
      //   icon: Package,
      // },
      // { title: "Payments", href: "/inventory", icon: Package },
      {
        title: "Transactions",
        href: "/client/pages/Supplier.tsx",
        icon: FileText,
      },
      // { title: "Bank Accounts", href: "/Supplier-Payments", icon: FileText },
      // { title: "Money Transfer", href: "/Supplier-Payments", icon: FileText },
    ],
  },
  {
    title: "Manage",
    icon: Package,
    children: [
      {
        title: "Manage Users",
        href: "/client/pages/Purchases.tsx",
        icon: Package,
      },
      // {
      //   title: "Memberships",
      //   href: "/client/pages/Purchases-order.tsx",
      //   icon: Package,
      // },
      // { title: "Contact Messages", href: "/inventory", icon: Package },
      // { title: "Tickets", href: "/client/pages/Supplier.tsx", icon: FileText },
    ],
  },
  // {
  //   title: "Administration",
  //   icon: Package,
  //   children: [
  //     { title: "Reports", href: "/client/pages/Purchases.tsx",icon: Package,},
  //     { title: "Settings", href: "/client/pages/Purchases-order.tsx" , icon: Package},
  //     ],
  // },
  // {
  //   title: "Layout",
  //   icon: Package,
  //   children: [
  //     { title: "Default", href: "/client/pages/Purchases.tsx",icon: Package,},
  //     { title: "Single", href: "/client/pages/Purchases-order.tsx" , icon: Package},
  //     { title: "Mini", href: "/inventory", icon: Package },
  //     { title: "Transactions",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "Without Header",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "RTL", href: "/Supplier-Payments", icon: FileText },
  //     { title: "Dark", href: "/Supplier-Payments", icon: FileText },
  //   ],
  // },
  // {
  //   title: "Contact",
  //   icon: Package,
  //   children: [
  //     { title: "Pages", href: "/client/pages/Purchases.tsx",icon: Package,},
  //     { title: "Blogs", href: "/client/pages/Purchases-order.tsx" , icon: Package},
  //     { title: "Location", href: "/inventory", icon: Package },
  //     { title: "Testimonials",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "FAQ'S",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     ],
  // },
  // {
  //   title: "Contact",
  //   icon: Package,
  //   children: [
  //     { title: "Profile", href: "/client/pages/Purchases.tsx",icon: Package,},
  //     { title: "Starter Page", href: "/client/pages/Purchases-order.tsx" , icon: Package},
  //     { title: "Gallery", href: "/inventory", icon: Package },
  //     { title: "Pricing",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "Timeline",  href: "/client/pages/Supplier.tsx", icon: FileText, },
  //     { title: "Coming Soon", href: "/app/calendar", icon: Calendar },
  //     { title: "Under Maintenance", href: "/app/email", icon: Mail },
  //     { title: "Error Pages", href: "/app/todo", icon: CheckSquare },
  //     { title: "API Keys", href: "/app/notes", icon: StickyNote },
  //     { title: "Privacy Policy", href: "/app/social", icon: Share2 },
  //     { title: "Terms & Conditions", href: "/app/files", icon: FolderOpen },
  //    ],
  // },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "Dashboard",
    "Super Admin",
    "Applications",
  ]);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title)
        ? prev.filter((item) => item !== title)
        : [...prev, title],
    );
  };

  // Sub-sidebar icons (vertical menu)
  const subSidebarIcons = [
    {
      icon: <LayoutDashboard className="h-3 w-3" />,
      label: "Dashboard",
      onClick: () => {
        window.location.href = "/";
      },
    },
    {
      icon: <Users className="h-3 w-3" />,
      label: "Users",
      onClick: () => {
        window.location.href = "/customers";
      },
    },
    {
      icon: <FileText className="h-3 w-3" />,
      label: "Invoices",
      onClick: () => {
        window.location.href = "/invoices";
      },
    },
    {
      icon: <Package className="h-3 w-3" />,
      label: "Products",
      onClick: () => {
        window.location.href = "/inventory/products";
      },
    },
    {
      icon: <Settings className="h-3 w-3" />,
      label: "Settings",
      onClick: () => {
        window.location.href = "/settings";
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sub-sidebar (vertical icon bar) */}
      <SidebarSubSidebar
        className="hidden lg:flex p-2"
        icons={subSidebarIcons}
        onPlusClick={() => {
          /* handle plus click if needed */
        }}
      />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 lg:left-14 z-50 w-52 lg:w-50 border-l border-gray-300 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex h-14  items-center px-5 ">
            <div className="flex items-center gap-2">
              <img
                src="https://tanishinfoservices.com/tiswebsite/img/logos/favicon.png"
                alt="Tanish Logo"
                className="h-10 w-10 object-contain"
              />
              <div className=" font-bold text-2xl ">Tanish</div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-2 overflow-hidden  space-y-4">
            {navigation.map((item) => (
              <div key={item.title}>
                {/* Section Title */}
                <div className="flex  items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider">
                  <span>{item.title}</span>
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {item.children?.map((child) => (
                    <div key={child.title || child.href}>
                      {child.children && child.children.length > 0 ? (
                        <div>
                          <Button
                            variant="ghost"
                            className="w-full ml-4 text-xs font-semibold justify-between h-6 px-2 text-sidebar-foreground  border-l-2 border-sidebar-border border-l-blue-900 hover:text-sidebar-accent-foreground"
                            onClick={() => toggleExpanded(child.title)}
                          >
                            <div className="flex  items-center gap-2 w-8 border-sidebar-border">
                              <child.icon className="h-4 w-4" />
                              <span className="text-sm">{child.title}</span>
                            </div>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 m-2 transition-transform duration-0",
                                expandedItems.includes(child.title)
                                  ? "rotate-180"
                                  : "",
                              )}
                            />
                          </Button>
                          {expandedItems.includes(child.title) && (
                            <div className="ml-6 mt-1 space-y-1">
                              {child.children.map((grandchild) => (
                                <Link
                                  key={grandchild.href}
                                  to={grandchild.href!}
                                  className={cn(
                                    "flex items-center m-0 px-2 py-2 h-6 text-xs transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-sidebar-border",
                                    location.pathname === grandchild.href
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "text-sidebar-foreground",
                                  )}
                                >
                                  <span>{grandchild.title}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={child.href!}
                          className={cn(
                            " ml-4 h-6 flex items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-sidebar-border border-blue-900",
                            location.pathname === child.href
                              ? "bg-sidebar-primary text-sidebar-primary-foreground"
                              : "text-sidebar-foreground",
                          )}
                        >
                          <child.icon className="h-4 w-4" />
                          {child.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Login Section */}
            <div className="space-y-1">
              <Link
                to="/Profile"
                className={cn(
                  "flex items-center font-semibold gap-2 rounded-md ml-4 h-6 px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-sidebar-border border-blue-900",
                  location.pathname === "/login"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground",
                )}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground  tracking-wider">
              <span>Authentication</span>
            </div>
            <div className="space-y-1">
              <Link
                to="/login"
                className={cn(
                  "flex items-center font-semibold gap-2 rounded-md ml-4 h-6 px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-2 border-sidebar-border border-blue-900",
                  location.pathname === "/login"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground",
                )}
              >
                <User className="h-4 w-4" />
                Login
              </Link>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-[16rem]">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-12 lg:h-14 items-center gap-2 lg:gap-4 border-b bg-card px-2 sm:px-4 lg:px-6 overflow-x-auto">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 lg:gap-2 text-xs lg:text-sm text-muted-foreground">
            <Home className="h-3 w-3 lg:h-4 lg:w-4" />
            <span className="font-semibold hidden sm:inline">Home</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-foreground font-semibold text-xs lg:text-sm">
              {location.pathname === "/"
                ? "Dashboard"
                : location.pathname.split("/").pop()}
            </span>
          </div>

          <div className="ml-auto flex items-center gap-1 lg:gap-2">
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-2 lg:left-3 top-1/2 h-3 w-3 lg:h-4 lg:w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search"
                className="w-24 sm:w-32 lg:w-48 h-8 lg:h-10 pl-6 lg:pl-10 text-xs lg:text-sm"
              />
            </div>

            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Notifications */}
            <NotificationPopup />

            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 lg:h-10 lg:w-10"
                >
                  <Sun className="h-3 w-3 lg:h-4 lg:w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-3 w-3 lg:h-4 lg:w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <Monitor className="mr-2 h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-6 w-6 lg:h-8 lg:w-8 rounded-full"
                >
                  <Avatar className="h-6 w-6 lg:h-8 lg:w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="text-xs">AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem>
                  <Link to="/profile" className="flex w-full">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/settings" className="flex w-full">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/login" className="flex w-full">
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-2 sm:p-4 lg:p-6 min-h-0">
          <div className="h-full overflow-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
