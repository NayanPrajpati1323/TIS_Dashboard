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
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  FileText
} from "lucide-react"

interface QuotationItem {
  id: number
  product_id?: number
  product_name?: string
  description: string
  quantity: number
  unit_price: number
  total: number
}

interface Quotation {
  id: number
  number: string
  customer_id: number
  customer_name: string
  customer_email: string
  date: string
  expiry_date: string
  subtotal: number
  tax_rate: number
  tax_amount: number
  discount_rate: number
  discount_amount: number
  total: number
  status: "accepted" | "declined" | "expired" | "sent" | "draft"
  notes?: string
  created_at: string
  updated_at: string
  items?: QuotationItem[]
}

export default function QuotationDetailsNew() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [quotation, setQuotation] = useState<Quotation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuotationDetails = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await fetch(`/api/quotations/${id}`)
        const data = await response.json()

        if (data.success) {
          setQuotation(data.data)
        } else {
          alert('Quotation not found')
          navigate('/quotations')
        }
      } catch (error) {
        console.error('Error fetching quotation details:', error)
        alert('Failed to load quotation details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotationDetails()
  }, [id, navigate])

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
      sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      accepted: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      declined: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400"
    }
    return colors[status as keyof typeof colors] || colors.draft
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="h-3 w-3" />
      case "declined":
        return <XCircle className="h-3 w-3" />
      case "expired":
        return <Clock className="h-3 w-3" />
      case "sent":
        return <Send className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading quotation details...</span>
      </div>
    )
  }

  if (!quotation) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold">Quotation not found</h2>
        <Button className="mt-4" onClick={() => navigate('/quotations')}>
          Back to Quotations
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/quotations")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Quotation {quotation.number}</h1>
            <p className="text-muted-foreground">Quotation details and information</p>
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
          <Button variant="outline" size="sm" onClick={() => navigate(`/quotations/create?edit=${quotation.id}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Quotation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quotation Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-primary">QUOTATION</h2>
                  <p className="text-lg font-semibold mt-1">#{quotation.number}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(quotation.status)} flex items-center gap-1`}>
                    {getStatusIcon(quotation.status)}
                    {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
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
                  <h3 className="font-semibold text-lg mb-2">Quote To</h3>
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {quotation.customer_name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-sm">
                      <div className="font-medium">{quotation.customer_name}</div>
                      <div className="text-muted-foreground">{quotation.customer_email}</div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Quote Date:</span>
                    <span className="ml-2 font-medium">{new Date(quotation.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="text-sm text-muted-foreground">Valid Until:</span>
                    <span className="ml-2 font-medium">{new Date(quotation.expiry_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Items */}
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
                    {quotation.items?.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">
                          <div>
                            <div className="font-medium">{item.product_name || item.description}</div>
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
          {quotation.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{quotation.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This quotation is valid for 30 days from the date of issue. 
                Payment is due within 30 days of quotation acceptance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quotation Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Quotation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${quotation.subtotal.toFixed(2)}</span>
              </div>
              
              {quotation.discount_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Discount ({quotation.discount_rate}%):</span>
                  <span>-${quotation.discount_amount.toFixed(2)}</span>
                </div>
              )}
              
              {quotation.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax ({quotation.tax_rate}%):</span>
                  <span>${quotation.tax_amount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total:</span>
                <span>${quotation.total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Actions */}
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
                Print Quotation
              </Button>
              <Button className="w-full" variant="outline">
                <Send className="mr-2 h-4 w-4" />
                Send to Customer
              </Button>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate(`/quotations/create?edit=${quotation.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Quotation
              </Button>
              <Separator />
              {quotation.status === 'sent' && (
                <>
                  <Button className="w-full" variant="default">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Accepted
                  </Button>
                  <Button className="w-full" variant="destructive">
                    <XCircle className="mr-2 h-4 w-4" />
                    Mark as Declined
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quotation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quotation Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created:</span>
                <span>{new Date(quotation.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Updated:</span>
                <span>{new Date(quotation.updated_at).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer ID:</span>
                <span>{quotation.customer_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span 
                  className={
                    new Date(quotation.expiry_date) < new Date() 
                      ? 'text-red-600 font-medium' 
                      : 'text-green-600 font-medium'
                  }
                >
                  {new Date(quotation.expiry_date).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
