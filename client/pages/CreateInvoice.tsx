import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  Plus,
  Trash2,
  Save,
  Send,
  Eye,
  ArrowLeft,
  Calendar as CalendarIcon,
  Search,
  User,
  Package,
  Calculator,
  FileText,
  Loader2
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface InvoiceItem {
  id: string
  productId: string
  productName: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Customer {
  id: string
  name: string
  email: string
  company?: string
  address: string
  city: string
  state: string
  zipCode: string
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  unit: string
}


export default function CreateInvoice() {
  const navigate = useNavigate()
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [customerSearchTerm, setCustomerSearchTerm] = useState("")
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [productSelectKey, setProductSelectKey] = useState(0)
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  const [invoiceNumber, setInvoiceNumber] = useState(`INV${Date.now().toString().slice(-6)}`)
  const [notes, setNotes] = useState("")
  const [terms, setTerms] = useState("Payment is due within 30 days of the invoice date.")
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [taxRate, setTaxRate] = useState() // 10% tax
  const [discountType, setDiscountType] = useState<"percentage" | "amount">("percentage")
  const [discountValue, setDiscountValue] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch customers and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          fetch('/api/customers'),
          fetch('/api/products')
        ])

        const customersData = await customersResponse.json()
        const productsData = await productsResponse.json()

        if (customersData.success) {
          const transformedCustomers = customersData.data.map((customer: any) => ({
            id: customer.id.toString(),
            name: customer.name,
            email: customer.email,
            company: customer.company,
            address: customer.address,
            city: customer.city,
            state: customer.state,
            zipCode: customer.postal_code
          }))
          setCustomers(transformedCustomers)
        }

        if (productsData.success) {
          const transformedProducts = productsData.data.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            price: product.price || 0,
            unit: product.unit || 'Piece'
          }))
          setProducts(transformedProducts)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const discountAmount = discountType === "percentage" 
    ? (subtotal * discountValue) / 100 
    : discountValue
  const taxableAmount = subtotal - discountAmount
  const taxAmount = (taxableAmount * taxRate) / 100
  const total = taxableAmount + taxAmount

  const addItem = (product: Product) => {
    try {
      console.log('Adding product:', product)
      
      if (!product || !product.id || !product.name) {
        console.error('Invalid product data:', product)
        return
      }
      
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        productId: product.id,
        productName: product.name,
        description: product.description || '',
        quantity: 1,
        rate: Number(product.price) || 0,
        amount: Number(product.price) || 0
      }
      console.log('New item created:', newItem)
      
      setItems(prev => {
        const updated = [...prev, newItem]
        console.log('Updated items:', updated)
        return updated
      })
      
      // Reset the product dropdown
      setProductSelectKey(prev => prev + 1)
      console.log('Product added successfully')
    } catch (error) {
      console.error('Error in addItem:', error)
    }
  }

  const updateItem = (itemId: string, field: keyof InvoiceItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "rate") {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate
        }
        return updatedItem
      }
      return item
    }))
  }

  const removeItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId))
  }



  const handleSaveDraft = async () => {
    await saveInvoice('draft')
  }

  const handleSendInvoice = async () => {
    await saveInvoice('sent')
  }

  const saveInvoice = async (status: 'draft' | 'sent') => {
    if (!selectedCustomer) {
      alert('Please select a customer')
      return
    }

    if (items.length === 0) {
      alert('Please add at least one item')
      return
    }

    try {
      setIsSubmitting(true)

      const invoiceData = {
        number: invoiceNumber,
        customer_id: parseInt(selectedCustomer.id),
        date: invoiceDate.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        discount_rate: discountType === 'percentage' ? discountValue : 0,
        discount_amount: discountAmount,
        total,
        status,
        notes
      }

      const invoiceItems = items.map(item => ({
        product_id: item.productId ? parseInt(item.productId) : null,
        description: item.description || item.productName,
        quantity: item.quantity,
        unit_price: item.rate,
        total: item.amount
      }))

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: invoiceData,
          items: invoiceItems
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(`Invoice ${status === 'draft' ? 'saved as draft' : 'sent'} successfully!`)
        navigate('/invoices')
      } else {
        alert(data.message || `Failed to ${status === 'draft' ? 'save draft' : 'send invoice'}`)
      }
    } catch (error) {
      console.error('Error saving invoice:', error)
      alert('Failed to save invoice')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-foreground">Create Invoice</h1>
          <p className="text-muted-foreground">Create a new invoice for your customer</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSendInvoice}>
            <Send className="mr-2 h-4 w-4" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge variant="secondary">Draft</Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Invoice Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !invoiceDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={invoiceDate}
                        onSelect={(date) => date && setInvoiceDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={(date) => date && setDueDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedCustomer ? (
                <div className="flex items-start justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedCustomer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedCustomer.name}</div>
                      {selectedCustomer.company && (
                        <div className="text-sm text-muted-foreground">{selectedCustomer.company}</div>
                      )}
                      <div className="text-sm text-muted-foreground">{selectedCustomer.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedCustomer.address}, {selectedCustomer.city}, {selectedCustomer.state} {selectedCustomer.zipCode}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setSelectedCustomer(null)}>
                    Change
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Select Customer</Label>
                  <Select
                    value={selectedCustomer?.id || ""}
                    onValueChange={(customerId) => {
                      const customer = customers.find(c => c.id === customerId)
                      if (customer) {
                        setSelectedCustomer(customer)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Search and select a customer..." />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No customers found. Please add customers first.
                        </div>
                      ) : (
                        customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            <div className="flex items-center gap-2">
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                {customer.company && (
                                  <div className="text-xs text-muted-foreground">{customer.company}</div>
                                )}
                                <div className="text-xs text-muted-foreground">{customer.email}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Invoice Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items
                </CardTitle>
                <div className="flex gap-2">
                  <Select
                    key={productSelectKey}
                    value={undefined}
                    onValueChange={(productId) => {
                      try {
                        console.log('Product selected:', productId)
                        const product = products.find(p => p.id === productId)
                        if (product) {
                          console.log('Found product:', product)
                          addItem(product)
                        } else {
                          console.error('Product not found for ID:', productId)
                        }
                      } catch (error) {
                        console.error('Error in product selection:', error)
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Add Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground text-sm">
                          No products found. Please add products first.
                        </div>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center justify-between w-full">
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                  {product.description}
                                </div>
                              </div>
                              <div className="text-right ml-2">
                                <div className="font-medium text-sm">${product.price}</div>
                                <div className="text-xs text-muted-foreground">per {product.unit}</div>
                              </div>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                 
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {items.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No items added yet. Click "Add Product" or "Add Custom Item" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start p-3 border rounded-lg">
                      <div className="col-span-4">
                        <Input
                          placeholder="Item name"
                          value={item.productName}
                          onChange={(e) => updateItem(item.id, "productName", e.target.value)}
                        />
                        <Textarea
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          className="mt-2"
                          rows={2}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          value={`$${item.amount.toFixed(2)}`}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Add any additional notes for the customer..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Enter payment terms and conditions..."
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Label>Discount</Label>
                <div className="flex gap-2">
                  <Select value={discountType} onValueChange={(value) => setDiscountType(value as "percentage" | "amount")}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">%</SelectItem>
                      <SelectItem value="amount">$</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    step="0.01"
                    value={discountValue}
                    onChange={(e) => setDiscountValue((e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Discount Amount</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>

              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span>Tax Amount</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={handleSendInvoice} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Invoice
              </Button>
              <Button variant="outline" className="w-full" onClick={handleSaveDraft} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save as Draft
              </Button>
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                Preview PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
