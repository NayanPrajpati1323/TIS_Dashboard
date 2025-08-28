import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  ArrowLeft,
  Download,
  Printer,
  Send,
  Edit,
  Loader2,
  User,
  Building,
  Mail,
  MapPin,
  Calendar,
  FileText,
  DollarSign
} from "lucide-react"

interface InvoiceItem {
  id: number
  product_id?: number
  product_name?: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface Invoice {
  id: number
  number: string
  customer_id: number
  customer_name: string
  customer_email: string
  date: string
  due_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  total: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  notes?: string
  created_at: string
  updated_at: string
  items?: InvoiceItem[]
}

export default function InvoiceDetailsNew() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/invoices/${id}`)
        const data = await response.json()

        if (data.success) {
          setInvoice(data.data)
        } else {
          alert('Invoice not found')
          navigate('/invoices')
        }
      } catch (error) {
        console.error('Error fetching invoice details:', error)
        alert('Failed to load invoice details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoiceDetails()
  }, [id, navigate])

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      paid: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      overdue: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      cancelled: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading invoice details...</span>
      </div>
    )
  }

  if (!invoice) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Invoice not found</h2>
        <Button className="mt-4" onClick={() => navigate('/invoices')}>
          Back to Invoices
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Invoice {invoice.number}</h1>
            <p className="text-muted-foreground">Invoice details and information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/edit/${invoice.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-primary">INVOICE</h2>
                  <p className="text-lg font-semibold mt-1">#{invoice.number}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* From */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">From</h3>
                  <div className="space-y-1 text-sm">
                    <div className="font-medium">Tanish</div>
                    <div className="text-muted-foreground">123 Business Street</div>
                    <div className="text-muted-foreground">New York, NY 10001</div>
                    <div className="text-muted-foreground">United States</div>
                    <div className="text-muted-foreground">contact@Tanish.com</div>
                    <div className="text-muted-foreground">+1 (555) 123-4567</div>
                  </div>
                </div>

                {/* To */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Bill To</h3>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {invoice.customer_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">{invoice.customer_name}</div>
                      <div className="text-muted-foreground">{invoice.customer_email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Invoice Date:</span>
                    <span className="ml-2 font-medium">{new Date(invoice.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Due Date:</span>
                    <span className="ml-2 font-medium">{new Date(invoice.due_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Description</th>
                      <th className="text-center p-3 font-medium w-20">Qty</th>
                      <th className="text-right p-3 font-medium w-24">Rate</th>
                      <th className="text-right p-3 font-medium w-24">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items?.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{item.product_name || 'Custom Item'}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-center">{item.quantity}</td>
                        <td className="p-3 text-right">${item.unit_price.toFixed(2)}</td>
                        <td className="p-3 text-right font-medium">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {invoice.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{invoice.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              
              {invoice.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount ({invoice.discount_rate}%):</span>
                  <span>-${invoice.discount_amount.toFixed(2)}</span>
                </div>
              )}
              
              {invoice.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({invoice.tax_rate}%):</span>
                  <span>${invoice.tax_amount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Invoice Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
              <Button className="w-full" variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Print Invoice
              </Button>
              <Button className="w-full" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send to Customer
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(`/invoices/edit/${invoice.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Invoice
              </Button>
            </CardContent>
          </Card>

          {/* Invoice Info */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(invoice.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span>{invoice.customer_id}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
