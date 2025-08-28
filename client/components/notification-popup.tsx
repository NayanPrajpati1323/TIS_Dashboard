import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Bell, CheckCircle, AlertCircle, Info, Clock } from "lucide-react"

const demoMessages = [
  {
    id: "1",
    title: "New Invoice Created",
    message: "Invoice #INV-2024-001 has been created successfully",
    type: "success",
    time: "2 minutes ago",
    read: false
  },
  {
    id: "2", 
    title: "Payment Received",
    message: "Payment of $2,500 received for Invoice #INV-2024-002",
    type: "success",
    time: "5 minutes ago",
    read: false
  },
  {
    id: "3",
    title: "Invoice Overdue",
    message: "Invoice #INV-2024-003 is now 3 days overdue",
    type: "warning", 
    time: "1 hour ago",
    read: true
  },
  {
    id: "4",
    title: "System Backup",
    message: "Daily system backup completed successfully",
    type: "info",
    time: "2 hours ago", 
    read: true
  },
  {
    id: "5",
    title: "New Customer Added",
    message: "Customer 'ABC Corporation' has been added to your database",
    type: "info",
    time: "3 hours ago",
    read: true
  }
]

export function NotificationPopup() {
  const [messages] = useState(demoMessages)
  const [open, setOpen] = useState(false)

  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "info": return <Info className="h-4 w-4 text-blue-500" />
      default: return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-80">
              <div className="space-y-1">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 hover:bg-muted/50 border-l-2 ${
                      message.read ? "border-transparent" : "border-primary"
                    } ${!message.read ? "bg-muted/30" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      {getIcon(message.type)}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{message.title}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {message.time}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{message.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
