import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye } from "lucide-react"

interface InvoiceTemplate {
  id: string
  name: string
  preview: string
  category: string
}

const invoiceTemplates: InvoiceTemplate[] = [
  {
    id: "1",
    name: "General Invoice 1",
    preview: "https://cdn.builder.io/api/v1/image/assets%2Fb2b14d9d9af0432b82f77eecc1168878%2F826ebf7ef54c408591dc6f83a5cf3510?format=webp&width=800",
    category: "General"
  },
  {
    id: "2", 
    name: "General Invoice 2",
    preview: "/placeholder.svg",
    category: "General"
  },
  {
    id: "3",
    name: "General Invoice 3", 
    preview: "/placeholder.svg",
    category: "General"
  },
  {
    id: "4",
    name: "General Invoice 4",
    preview: "/placeholder.svg", 
    category: "General"
  },
  {
    id: "5",
    name: "General Invoice 5",
    preview: "/placeholder.svg",
    category: "General"
  }
]

export default function InvoiceTemplates() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewingTemplate, setViewingTemplate] = useState<InvoiceTemplate | null>(null)

  const filteredTemplates = invoiceTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Invoice Templates</h1>
        <p className="text-muted-foreground">Choose from our collection of professional invoice templates</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="aspect-[3/4] bg-muted relative overflow-hidden">
              <img 
                src={template.preview} 
                alt={template.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  size="sm"
                  onClick={() => setViewingTemplate(template)}
                  className="bg-white text-black hover:bg-white/90"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-center">{template.name}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <Search className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold text-foreground">No templates found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try adjusting your search criteria
          </p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!viewingTemplate} onOpenChange={() => setViewingTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Template Preview: {viewingTemplate?.name}</DialogTitle>
            <DialogDescription>
              Preview of the {viewingTemplate?.name} template
            </DialogDescription>
          </DialogHeader>
          <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
            <img 
              src={viewingTemplate?.preview || "/placeholder.svg"} 
              alt={viewingTemplate?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
