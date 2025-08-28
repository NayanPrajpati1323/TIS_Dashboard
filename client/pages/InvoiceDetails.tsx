import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Download,
  Printer,
  Send,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Share2,
} from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  tax: number;
}

interface Invoice {
  id: string;
  number: string;
  status: "Draft" | "Sent" | "Paid" | "Overdue" | "Cancelled";
  issueDate: string;
  dueDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  paidAmount: number;
  balanceAmount: number;
  notes: string;
  terms: string;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  paidAt?: string;
}

const sampleInvoice: Invoice = {
  id: "1",
  number: "INV-2024-001",
  status: "Sent",
  issueDate: "2024-01-15",
  dueDate: "2024-02-15",
  customer: {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business Street",
    city: "New York",
    state: "NY",
    country: "United States",
    zipCode: "10001",
  },
  items: [
    {
      id: "1",
      description: "Web Design Services",
      quantity: 1,
      rate: 2500.0,
      amount: 2500.0,
      tax: 10,
    },
    {
      id: "2",
      description: "SEO Optimization",
      quantity: 1,
      rate: 800.0,
      amount: 800.0,
      tax: 10,
    },
    {
      id: "3",
      description: "Content Management System",
      quantity: 1,
      rate: 1200.0,
      amount: 1200.0,
      tax: 10,
    },
  ],
  subtotal: 4500.0,
  taxRate: 10,
  taxAmount: 450.0,
  discountRate: 5,
  discountAmount: 225.0,
  total: 4725.0,
  paidAmount: 0,
  balanceAmount: 4725.0,
  notes: "Thank you for your business. Please make payment within 30 days.",
  terms:
    "Payment is due within 30 days of invoice date. Late payments may incur additional fees.",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  sentAt: "2024-01-15T14:30:00Z",
};

export default function InvoiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<Invoice>(sampleInvoice);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [emailSubject, setEmailSubject] = useState(
    `Invoice ${invoice.number} from Tanish`,
  );
  const [emailMessage, setEmailMessage] = useState(
    `Dear ${invoice.customer.name},\n\nPlease find attached your invoice ${invoice.number}.\n\nThank you for your business!`,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
      case "Sent":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      case "Paid":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "Overdue":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "Cancelled":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Draft":
        return <FileText className="h-4 w-4" />;
      case "Sent":
        return <Send className="h-4 w-4" />;
      case "Paid":
        return <CheckCircle className="h-4 w-4" />;
      case "Overdue":
        return <AlertCircle className="h-4 w-4" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const handlePrint = () => {
    window.print();
    alert("Invoice print dialog opened");
  };

  const handleDownload = () => {
    // Simple alert for demo - in real app would trigger PDF download
    alert("Invoice PDF download started");
  };

  const handleDownloadAsTemplate = () => {
    // Simple alert for demo - in real app would save as template
    alert("Invoice saved as template successfully");
  };

  const handleSendEmail = () => {
    setInvoice((prev) => ({
      ...prev,
      status: "Sent",
      sentAt: new Date().toISOString(),
    }));
    setIsSendDialogOpen(false);
    alert(
      `Invoice ${invoice.number} has been sent to ${invoice.customer.email}`,
    );
  };

  const handleRecordPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (amount > 0) {
      setInvoice((prev) => ({
        ...prev,
        paidAmount: prev.paidAmount + amount,
        balanceAmount: prev.balanceAmount - amount,
        status: prev.balanceAmount - amount <= 0 ? "Paid" : prev.status,
        paidAt:
          prev.balanceAmount - amount <= 0
            ? new Date().toISOString()
            : prev.paidAt,
      }));
      setPaymentAmount("");
      setIsPaymentDialogOpen(false);
      alert(`Payment of $${amount.toFixed(2)} has been recorded`);
    }
  };

  const handleDuplicate = () => {
    alert(`A copy of invoice ${invoice.number} has been created`);
    navigate("/invoices/create");
  };

  const handleDelete = () => {
    alert(`Invoice ${invoice.number} has been deleted`);
    navigate("/invoices");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Invoice Details
            </h1>
            <p className="text-muted-foreground">Invoice {invoice.number}</p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSendDialogOpen(true)}
          >
            <Send className="mr-2 h-4 w-4" />
            Send
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Invoice
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsPaymentDialogOpen(true)}>
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadAsTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Download as Template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Link
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Invoice Status and Overview */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              {getStatusIcon(invoice.status)}
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
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
                <div className="text-sm text-muted-foreground">
                  Total Amount
                </div>
                <div className="text-lg font-semibold">
                  ${invoice.total.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-muted-foreground">Paid Amount</div>
                <div className="text-lg font-semibold">
                  ${invoice.paidAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-orange-600" />
              <div>
                <div className="text-sm text-muted-foreground">Balance</div>
                <div className="text-lg font-semibold">
                  ${invoice.balanceAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Invoice Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Info and Customer Info */}
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-3">From</h3>
                <div className="space-y-1 text-sm">
                  <div className="font-medium">Tanish</div>
                  <div className="text-muted-foreground">
                    123 Business Street
                  </div>
                  <div className="text-muted-foreground">
                    New York, NY 10001
                  </div>
                  <div className="text-muted-foreground">United States</div>
                  <div className="text-muted-foreground">
                    contact@tanish.com
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Bill To</h3>
                <div className="space-y-1 text-sm">
                  <div className="font-medium">{invoice.customer.name}</div>
                  <div className="text-muted-foreground">
                    {invoice.customer.address}
                  </div>
                  <div className="text-muted-foreground">
                    {invoice.customer.city}, {invoice.customer.state}{" "}
                    {invoice.customer.zipCode}
                  </div>
                  <div className="text-muted-foreground">
                    {invoice.customer.country}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {invoice.customer.email}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {invoice.customer.phone}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Dates */}
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label className="text-sm font-medium">Invoice Number</Label>
                <div className="font-mono text-sm mt-1">{invoice.number}</div>
              </div>
              <div>
                <Label className="text-sm font-medium">Issue Date</Label>
                <div className="text-sm mt-1">
                  {new Date(invoice.issueDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Due Date</Label>
                <div className="text-sm mt-1">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Separator />

            {/* Invoice Items */}
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
                  {invoice.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.description}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.rate.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        ${item.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount ({invoice.discountRate}%):</span>
                <span>-${invoice.discountAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({invoice.taxRate}%):</span>
                <span>${invoice.taxAmount.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes and Terms */}
            {invoice.notes && (
              <div>
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{invoice.notes}</p>
              </div>
            )}

            {invoice.terms && (
              <div>
                <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                <p className="text-sm text-muted-foreground">{invoice.terms}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="space-y-1">
                  <div className="text-sm font-medium">Invoice Created</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(invoice.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
              {invoice.sentAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Invoice Sent</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(invoice.sentAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
              {invoice.paidAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Payment Received</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(invoice.paidAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Send Email Dialog */}
      <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Invoice</DialogTitle>
            <DialogDescription>
              Send invoice {invoice.number} to {invoice.customer.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                rows={5}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSendDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Record Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment for invoice {invoice.number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Amount:</span>
                <div className="font-semibold">${invoice.total.toFixed(2)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Balance Due:</span>
                <div className="font-semibold">
                  ${invoice.balanceAmount.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment}>Record Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
