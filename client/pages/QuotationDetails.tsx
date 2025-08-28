import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ArrowLeft,
  Download,
  Printer,
  Send,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react"

interface QuotationItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface QuotationDetailsType {
  id: string
  quotationNumber: string
  status: "Accepted" | "Declined" | "Expired" | "Sent" | "Draft"
  issueDate: string
  validUntil: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: QuotationItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  notes: string
  terms: string
}

const sampleQuotation: QuotationDetailsType = {
  id: "1",
  quotationNumber: "QUO001",
  status: "Sent",
  issueDate: "2024-02-15",
  validUntil: "2024-03-15",
  customer: {
    name: "Emily Clark",
    email: "emily.clark@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street, New York, NY 10001"
  },
  items: [
    {
      id: "1",
      description: "Website Design & Development",
      quantity: 1,
      rate: 3500.00,
      amount: 3500.00
    },
    {
      id: "2",
      description: "SEO Optimization Package",
      quantity: 1,
      rate: 800.00,
      amount: 800.00
    },
    {
      id: "3",
      description: "Content Management Training",
      quantity: 2,
      rate: 150.00,
      amount: 300.00
    }
  ],
  subtotal: 4600.00,
  taxRate: 10,
  taxAmount: 460.00,
  discountRate: 5,
  discountAmount: 230.00,
  total: 4830.00,
  notes: "Thank you for considering our services. We look forward to working with you.",
  terms: "This quotation is valid for 30 days from the date of issue. Payment terms: 50% advance, 50% on completion."
}

export default function QuotationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quotation] = useState<QuotationDetailsType>(sampleQuotation)

  const getStatusColor = (status: string) => {
    const colors = {
      Accepted: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      Declined: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
      Expired: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      Sent: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      Draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
    return colors[status as keyof typeof colors] || colors.Draft
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accepted":
        return <CheckCircle className="h-4 w-4" />
      case "Declined":
        return <XCircle className="h-4 w-4" />
      case "Expired":
        return <Clock className="h-4 w-4" />
      case "Sent":
        return <Send className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const handlePrint = () => {
    window.print()
    alert("Quotation print dialog opened")
  }

  const handleDownload = () => {
    alert("Quotation PDF download started")
  }

  const handleSend = () => {
    alert("Quotation sent to customer")
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/quotations")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Quotation Details</h1>
            <p className="text-muted-foreground">Quotation {quotation.quotationNumber}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleSend}>
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <Button size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Status and Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(quotation.status)}
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className={getStatusColor(quotation.status)}>
                  {quotation.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-muted-foreground">Total Amount</div>
                <div className="text-lg font-semibold">${quotation.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Issue Date</div>
                <div className="text-sm font-medium">{new Date(quotation.issueDate).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-muted-foreground">Valid Until</div>
                <div className="text-sm font-medium">{new Date(quotation.validUntil).toLocaleDateString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Quotation Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Company and Customer Info */}
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold mb-3">From</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">Tanish</div>
                <div className="text-muted-foreground">123 Business Street</div>
                <div className="text-muted-foreground">New York, NY 10001</div>
                <div className="text-muted-foreground">United States</div>
                <div className="text-muted-foreground">contact@tanish.com</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">To</h3>
              <div className="space-y-1 text-sm">
                <div className="font-medium">{quotation.customer.name}</div>
                <div className="text-muted-foreground">{quotation.customer.address}</div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Mail className="h-3 w-3" />
                  {quotation.customer.email}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Phone className="h-3 w-3" />
                  {quotation.customer.phone}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Quotation Details */}
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="text-sm font-medium">Quotation Number</div>
              <div className="font-mono text-sm mt-1">{quotation.quotationNumber}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Issue Date</div>
              <div className="text-sm mt-1">{new Date(quotation.issueDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Valid Until</div>
              <div className="text-sm mt-1">{new Date(quotation.validUntil).toLocaleDateString()}</div>
            </div>
          </div>

          <Separator />

          {/* Items */}
          <div>
            <h3 className="font-semibold mb-3">Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotation.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <Separator />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${quotation.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount ({quotation.discountRate}%):</span>
                <span>-${quotation.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({quotation.taxRate}%):</span>
                <span>${quotation.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${quotation.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes and Terms */}
          {quotation.notes && (
            <div>
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground">{quotation.notes}</p>
            </div>
          )}

          {quotation.terms && (
            <div>
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <p className="text-sm text-muted-foreground">{quotation.terms}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
