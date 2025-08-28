import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
  Tag,
  Ruler,
  Plus,
  Eye,
  RefreshCw,
  User,
  Monitor
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationItem {
  title: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  children?: NavigationItem[]
}

const navigation: NavigationItem[] = [
  {
    title: "Main",
    icon: LayoutDashboard,
    children: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        children: [
          { title: "Dashboard", href: "/", icon: LayoutDashboard },
          { title: "Admin Dashboard", href: "/admin-dashboard", icon: LayoutDashboard },
          { title: "Admin Dashboard 2", href: "/admin-dashboard-2", icon: LayoutDashboard },
          { title: "Customer Dashboard", href: "/customer-dashboard", icon: LayoutDashboard },
          { title: "Super Admin Dashboard", href: "/super-admin-dashboard", icon: LayoutDashboard },
        ]
      },
      {
        title: "Super Admin",
        icon: User,
        children: [
          { title: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
          { title: "Companies", href: "/super-admin/companies", icon: Users },
          { title: "Subscriptions", href: "/super-admin/subscriptions", icon: Package },
          { title: "Packages", href: "/super-admin/packages", icon: Package },
          { title: "Domain", href: "/super-admin/domain", icon: Globe },
          { title: "Purchase Transaction", href: "/super-admin/transactions", icon: ShoppingCart },
        ]
      },
      {
        title: "Frontend",
        icon: Monitor,
        children: []
      },
      {
        title: "Applications",
        icon: LayoutDashboard,
        children: [
          { title: "Chat", href: "/app/chat", icon: MessageSquare },
          {
            title: "Calls",
            icon: Phone,
            children: [
              { title: "Voice Call", href: "/app/calls/voice", icon: Phone },
              { title: "Video Call", href: "/app/calls/video", icon: Phone },
              { title: "Outgoing Call", href: "/app/calls/outgoing", icon: Phone },
              { title: "Incoming Call", href: "/app/calls/incoming", icon: Phone },
              { title: "Call History", href: "/app/calls/history", icon: Phone }
            ]
          },
          { title: "Calendar", href: "/app/calendar", icon: Calendar },
          { title: "Email", href: "/app/email", icon: Mail },
          { title: "To Do", href: "/app/todo", icon: CheckSquare },
          { title: "Notes", href: "/app/notes", icon: StickyNote },
          { title: "Social Feed", href: "/app/social", icon: Share2 },
          { title: "File Manager", href: "/app/files", icon: FolderOpen },
          { title: "Kanban", href: "/app/kanban", icon: Kanban },
          { title: "Contacts", href: "/app/contacts", icon: UserCheck },
          { title: "Invoices", href: "/app/invoices", icon: FileText },
          { title: "Search List", href: "/app/search", icon: Search },
        ]
      }
    ]
  },
  {
    title: "Inventory & Sales",
    icon: Package,
    children: [
      {
        title: "Product/Services",
        icon: Package,
        children: [
          { title: "Products", href: "/inventory/products", icon: Package },
          { title: "Category", href: "/inventory/categories", icon: Tag },
          { title: "Units", href: "/inventory/units", icon: Ruler }
        ]
      },
      { title: "Inventory", href: "/inventory", icon: Package },
      {
        title: "Invoice",
        icon: FileText,
        children: [
          { title: "Invoice", href: "/invoices", icon: FileText },
          { title: "Create Invoice", href: "/invoices/create", icon: Plus },
          { title: "Invoice Details", href: "/invoices/details", icon: Eye },
          { title: "Invoice Templates", href: "/invoices/templates", icon: FileText },
          { title: "Recurring Invoice", href: "/invoices/recurring", icon: RefreshCw }
        ]
      },
      { title: "Credit Notes", href: "/credit-notes", icon: FileText },
      { title: "Quotations", href: "/quotations", icon: FileText },
      { title: "Delivery Challans", href: "/delivery-challans", icon: FileText },
      {
        title: "Customers",
        icon: UserCheck,
        children: [
          { title: "Customer", href: "/customers", icon: Users },
          { title: "Customer Details", href: "/customers/details", icon: User }
        ]
      }
    ]
  }
]

interface MobileMenuProps {
  children: React.ReactNode
}

export function MobileMenu({ children }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard", "Super Admin", "Applications"])
  const location = useLocation()

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    if (item.children && item.children.length > 0) {
      return (
        <Collapsible key={item.title} open={expandedItems.includes(item.title)} onOpenChange={() => toggleExpanded(item.title)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-between h-auto py-2 px-3 text-left font-normal",
                level === 0 && "text-xs font-semibold text-muted-foreground uppercase tracking-wider"
              )}
            >
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </div>
              {level > 0 && <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-1 ml-6">
            {item.children.map((child) => renderNavigationItem(child, level + 1))}
          </CollapsibleContent>
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.href}
        to={item.href!}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
          location.pathname === item.href
            ? "bg-accent text-accent-foreground font-medium"
            : "text-muted-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {item.title}
      </Link>
    )
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center justify-center">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2Fb2b14d9d9af0432b82f77eecc1168878%2Ff8bc2155db8344b3b57796dec05e1a22?format=webp&width=800"
              alt="Tanish Logo"
              className="h-12 w-12 object-contain"
            />
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 py-4">
            {navigation.map((section) => (
              <div key={section.title}>
                <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </div>
                <div className="space-y-1">
                  {section.children?.map((item) => renderNavigationItem(item, 1))}
                </div>
              </div>
            ))}
            
            <Separator />
            
            {/* Authentication Section */}
            <div>
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <User className="h-4 w-4" />
                <span>Authentication</span>
              </div>
              <div className="space-y-1">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                    location.pathname === "/login"
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <User className="h-4 w-4" />
                  Login
                </Link>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <div className="border-t p-6">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              v1.0.0
            </Badge>
            <span className="text-xs text-muted-foreground">Tanish Dashboard</span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
