import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Plus,
  Trash2,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Send,
  Loader2,
} from "lucide-react";

interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
  product_id?: number;
}

interface QuotationForm {
  quotationNumber: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  quotationDate: string;
  validUntil: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountRate: number;
  discountAmount: number;
  total: number;
  notes: string;
  terms: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
}

export default function CreateQuotation() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productSelectKey, setProductSelectKey] = useState(0);
  const [quotation, setQuotation] = useState<QuotationForm>({
    quotationNumber: `QUO${String(Date.now()).slice(-6)}`,
    customer: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
    quotationDate: new Date().toISOString().split("T")[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    items: [],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    total: 0,
    notes: "",
    terms:
      "Payment is due within 30 days of quotation date. This quotation is valid for 30 days from the date of issue.",
  });

  // Fetch customers and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, productsResponse] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
        ]);

        const customersData = await customersResponse.json();
        const productsData = await productsResponse.json();

        if (customersData.success) {
          const transformedCustomers = customersData.data.map(
            (customer: any) => ({
              id: customer.id.toString(),
              name: customer.name,
              email: customer.email,
              phone: customer.phone,
              company: customer.company,
              address: customer.address,
              city: customer.city,
              state: customer.state,
              zipCode: customer.postal_code,
            }),
          );
          setCustomers(transformedCustomers);
        }

        if (productsData.success) {
          const transformedProducts = productsData.data.map((product: any) => ({
            id: product.id.toString(),
            name: product.name,
            description: product.description,
            price: product.price || 0,
            unit: product.unit || "Piece",
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Calculate totals whenever items, tax, or discount changes
  useEffect(() => {
    const subtotal = quotation.items.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const discountAmount = (subtotal * quotation.discountRate) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxAmount = (taxableAmount * quotation.taxRate) / 100;
    const total = taxableAmount + taxAmount;

    setQuotation((prev) => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total,
    }));
  }, [quotation.items, quotation.taxRate, quotation.discountRate]);



  const removeItem = (itemId: string) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const updateItem = (
    itemId: string,
    field: keyof QuotationItem,
    value: string | number,
  ) => {
    setQuotation((prev) => ({
      ...prev,
      items: prev.items.map((item) => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value };
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      }),
    }));
  };

  const handleSave = async (status: "Draft" | "Sent" = "Draft") => {
    if (!selectedCustomer) {
      alert("Please select a customer");
      return;
    }

    if (quotation.items.length === 0) {
      alert("Please add at least one item");
      return;
    }

    if (quotation.items.some((item) => !item.description.trim() || item.quantity <= 0 || item.rate <= 0)) {
      alert("Please fill in all item descriptions, quantities, and rates");
      return;
    }

    try {
      setIsSubmitting(true);

      const quotationData = {
        number: quotation.quotationNumber,
        customer_id: parseInt(selectedCustomer.id),
        date: quotation.quotationDate,
        expiry_date: quotation.validUntil,
        subtotal: quotation.subtotal,
        tax_rate: quotation.taxRate,
        tax_amount: quotation.taxAmount,
        discount_rate: quotation.discountRate,
        discount_amount: quotation.discountAmount,
        total: quotation.total,
        status: status.toLowerCase(),
        notes: quotation.notes,
      };

      const quotationItems = quotation.items.map((item) => ({
        product_id: item.product_id || null,
        description: item.description || null,
        quantity: item.quantity,
        unit_price: item.rate,
        total: item.amount,
      }));
      console.log("QuotationItems",quotationItems )

      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quotation: quotationData,
          items: quotationItems,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(
          `Quotation ${status === "Draft" ? "saved as draft" : "sent"} successfully!`,
        );
        navigate("/quotations");
      } else {
        alert(
          data.message ||
            `Failed to ${status === "Draft" ? "save draft" : "send quotation"}`,
        );
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      alert("Failed to save quotation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setQuotation((prev) => ({
      ...prev,
      customer: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone || "",
      customerAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`,
    }));
  };

  const addProductToItems = (product: Product) => {
    try {
      console.log("Adding product to quotation:", product);

      if (!product || !product.id || !product.name) {
        console.error("Invalid product data for quotation:", product);
        return;
      }

      const newItem: QuotationItem = {
        id: Date.now().toString(),
        description: product.name,
        quantity: 1,
        rate: Number(product.price) || 0,
        amount: Number(product.price) || 0,
        product_id: parseInt(product.id),
      };
      console.log("New quotation item created:", newItem);

      setQuotation((prev) => {
        const updated = {
          ...prev,
          items: [...prev.items, newItem],
        };
        console.log("Updated quotation:", updated);
        return updated;
      });

      console.log("Product added to quotation successfully");
    } catch (error) {
      console.error("Error in addProductToItems:", error);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/quotations")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Add Quotation
            </h1>
            <p className="text-muted-foreground">
              Create a new quotation for your customer
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave("Draft")}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save as Draft
          </Button>
          <Button onClick={() => handleSave("Sent")} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Save & Send
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Customer & Quotation Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name *</Label>
                  {selectedCustomer ? (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">
                          {selectedCustomer.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {selectedCustomer.email}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedCustomer(null);
                          setQuotation((prev) => ({
                            ...prev,
                            customer: "",
                            customerEmail: "",
                            customerAddress: "",
                          }));
                        }}
                      >
                        Change
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value=""
                      onValueChange={(value) => {
                        const customer = customers.find((c) => c.id === value);
                        if (customer) selectCustomer(customer);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a customer" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.length === 0 ? (
                          <div className="p-2 text-center text-muted-foreground">
                            No customers found. Please add customers first.
                          </div>
                        ) : (
                          customers.map((customer) => (
                            <SelectItem key={customer.id} value={customer.id}>
                              <div>
                                <div className="font-medium">
                                  {customer.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {customer.email}
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="customerEmail"
                      type="email"
                      value={quotation.customerEmail}
                      onChange={(e) =>
                        setQuotation((prev) => ({
                          ...prev,
                          customerEmail: e.target.value,
                        }))
                      }
                      placeholder="customer@example.com"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="customerPhone"
                      value={quotation.customerPhone}
                      onChange={(e) =>
                        setQuotation((prev) => ({
                          ...prev,
                          customerPhone: e.target.value,
                        }))
                      }
                      placeholder="+1 (555) 000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="customerAddress"
                      value={quotation.customerAddress}
                      onChange={(e) =>
                        setQuotation((prev) => ({
                          ...prev,
                          customerAddress: e.target.value,
                        }))
                      }
                      placeholder="Customer address"
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Quotation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quotationNumber">Quotation Number</Label>
                  <Input
                    id="quotationNumber"
                    value={quotation.quotationNumber}
                    onChange={(e) =>
                      setQuotation((prev) => ({
                        ...prev,
                        quotationNumber: e.target.value,
                      }))
                    }
                    placeholder="QUO001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quotationDate">Quotation Date</Label>
                  <Input
                    id="quotationDate"
                    type="date"
                    value={quotation.quotationDate}
                    onChange={(e) =>
                      setQuotation((prev) => ({
                        ...prev,
                        quotationDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="validUntil">Valid Until</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={quotation.validUntil}
                    onChange={(e) =>
                      setQuotation((prev) => ({
                        ...prev,
                        validUntil: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Items</CardTitle>
                <div className="flex gap-2">
                  <Select
                    key={productSelectKey}
                    value={undefined}
                    onValueChange={(value) => {
                      try {
                        console.log("Product selected in quotation:", value);
                        const product = products.find((p) => p.id === value);
                        if (product) {
                          console.log("Found product for quotation:", product);
                          addProductToItems(product);
                          // Reset the select by changing its key
                          setProductSelectKey((prev) => prev + 1);
                        } else {
                          console.error(
                            "Product not found for ID in quotation:",
                            value,
                          );
                        }
                      } catch (error) {
                        console.error(
                          "Error in quotation product selection:",
                          error,
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Add Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.length === 0 ? (
                        <div className="p-2 text-center text-muted-foreground">
                          No products found
                        </div>
                      ) : (
                        products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ${product.price}
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
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow >
                      <TableHead className="min-w-[300px]">
                        Description
                      </TableHead>
                      <TableHead className="w-36">Qty</TableHead>
                      <TableHead className="w-40">Rate</TableHead>
                      <TableHead className="w-32">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody >
                    {quotation.items.map((item) => (
                      <TableRow key={item.id} className=" hover:bg-muted  gap-0">
                        <TableCell>
                          <Input
                            value={item.description}
                            onChange={(e) =>
                              updateItem(item.id, "description", e.target.value)
                            }
                            placeholder="Item description"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "quantity",
                                parseInt(e.target.value) || 1,
                              )
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                item.id,
                                "rate",
                                parseFloat(e.target.value) || 0,
                              )
                            }
                            placeholder="0"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${item.amount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {quotation.items.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Notes and Terms */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={quotation.notes}
                  onChange={(e) =>
                    setQuotation((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Additional notes for the customer"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={quotation.terms}
                  onChange={(e) =>
                    setQuotation((prev) => ({ ...prev, terms: e.target.value }))
                  }
                  placeholder="Terms and conditions"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${quotation.subtotal.toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="discountRate">Discount (%):</Label>
                    <div className="w-20">
                      <Input
                        id="discountRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={
                          quotation.discountRate === null
                            ? ""
                            : quotation.discountRate
                        }
                        onFocus={(e) => {
                          if (e.target.value === "0") {
                            setQuotation((prev) => ({
                              ...prev,
                              discountRate: "",
                            }));
                          }
                        }}
                        onChange={(e) =>
                          setQuotation((prev) => ({
                            ...prev,
                            discountRate:
                              e.target.value === "" ? "" : e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Discount Amount:</span>
                    <span>-${quotation.discountAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="taxRate">Tax (%):</Label>
                    <div className="w-20">
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={quotation.taxRate === 0 ? "" : quotation.taxRate}
                        onChange={(e) =>
                          setQuotation((prev) => ({
                            ...prev,
                            taxRate:
                              e.target.value === ""
                                ? 0
                                : parseFloat(e.target.value),
                          }))
                        }
                        onFocus={(e) => {
                          if (quotation.taxRate === 0) {
                            e.target.value = "";
                          }
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            setQuotation((prev) => ({
                              ...prev,
                              taxRate: 0,
                            }));
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax Amount:</span>
                    <span>${quotation.taxAmount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>${quotation.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>From</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="font-medium">Tanish</div>
                <div className="text-muted-foreground">123 Business Street</div>
                <div className="text-muted-foreground">New York, NY 10001</div>
                <div className="text-muted-foreground">United States</div>
                <div className="text-muted-foreground">contact@Tanish.com</div>
                <div className="text-muted-foreground">+1 (555) 123-4567</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
