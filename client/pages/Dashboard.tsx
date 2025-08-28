import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Plus,
  Download,
  Filter,
  ChevronDown,
  Receipt,
  CreditCard,
  ShoppingCart,
  MessageSquare,
  Truck,
  Eye,
  ArrowUpRight,
  Star,
  User,
  Mail,
  Phone
} from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

// Dashboard greeting data
const greetingData = {
  name: "Nayan Prajapati",
  message: "You have 34 invoices need to start that has to send to customers",
  date: "Friday 24 Mar 2023",
  time: "11:34 AM"
}

// Overview stats
const overviewStats = [
  {
    title: "KTH",
    value: "1431",
    icon: FileText,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    change: "+2.6%",
    changeType: "up"
  },
  {
    title: "Customers",
    value: "3,462",
    icon: Users,
    iconBg: "bg-orange-100", 
    iconColor: "text-orange-600",
    change: "+18.1%",
    changeType: "up"
  },
  {
    title: "Revenue Due",
    value: "$1642",
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    change: "-2.4%",
    changeType: "down"
  }
]

// Sales analytics
const salesAnalytics = [
  {
    title: "Total Sales",
    value: "$40,569",
    change: "+8.2%",
    changeType: "up",
    icon: TrendingUp,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600"
  },
  {
    title: "Revenue",
    value: "$134,290",
    change: "+23.1%", 
    changeType: "up",
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Expenses",
    value: "$90,041",
    change: "-1.4%",
    changeType: "down",
    icon: TrendingDown,
    iconBg: "bg-red-100",
    iconColor: "text-red-600"
  }
]

// Invoice statistics
const invoiceStats = [
  {
    title: "Total Invoice",
    value: "$2182",
    change: "+22.1%",
    changeType: "up",
    icon: FileText,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  {
    title: "Revenue & Profit",
    value: "$10,783",
    change: "+38.6%",
    changeType: "up", 
    icon: DollarSign,
    iconBg: "bg-green-100",
    iconColor: "text-green-600"
  },
  {
    title: "Outstanding",
    value: "$6981.2",
    change: "+14.7%",
    changeType: "up",
    icon: TrendingUp,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600"
  }
]

// Revenue chart data
const revenueChartData = [
  { month: 'Mon', revenue: 200 },
  { month: 'Tue', revenue: 900 },
  { month: 'Wed', revenue: 600 },
  { month: 'Thu', revenue: 800 },
  { month: 'Fri', revenue: 400 },
  { month: 'Sat', revenue: 1000 },
  { month: 'Sun', revenue: 800 }
]

// Customer data
const topCustomers = [
  {
    id: 1,
    name: "Emily Clark",
    email: "emily@gmazon.com",
    avatar: "/placeholder.svg",
    outstanding: "$3009",
    status: "Outstanding"
  },
  {
    id: 2,
    name: "John Smith", 
    email: "john@gmazon.com",
    avatar: "/placeholder.svg",
    outstanding: "$5405",
    status: "Outstanding"
  },
  {
    id: 3,
    name: "Sophia White",
    email: "sophia@gmazon.com", 
    avatar: "/placeholder.svg",
    outstanding: "$4663",
    status: "Outstanding"
  },
  {
    id: 4,
    name: "William Parker",
    email: "william@gmazon.com",
    avatar: "/placeholder.svg",
    outstanding: "$3364",
    status: "Outstanding"
  },
  {
    id: 5,
    name: "Charlotte Brown",
    email: "charlotte@gmazon.com",
    avatar: "/placeholder.svg",
    outstanding: "$4609",
    status: "Outstanding"
  }
]

// Recent invoices
const recentInvoices = [
  {
    id: "INV00005",
    customer: "Emily Clark",
    avatar: "/placeholder.svg",
    date: "22 Feb 2023",
    amount: "$10,000",
    paid: "$5,000",
    status: "Cash",
    paymentMode: "Cash"
  },
  {
    id: "INV00004",
    customer: "John Carter",
    avatar: "/placeholder.svg", 
    date: "07 Feb 2023",
    amount: "$25,750",
    paid: "$5,000",
    status: "Check",
    paymentMode: "Check"
  },
  {
    id: "INV00003",
    customer: "Sophia White",
    avatar: "/placeholder.svg",
    date: "09 Feb 2023",
    amount: "$120,500",
    paid: "$50,000",
    status: "Check",
    paymentMode: "Check"
  },
  {
    id: "INV00002",
    customer: "Michael Johnson",
    avatar: "/placeholder.svg",
    date: "30 Jan 2023",
    amount: "$250,900",
    paid: "$50,000",
    status: "Check",
    paymentMode: "Check"
  },
  {
    id: "INV00001",
    customer: "William Parker",
    avatar: "/placeholder.svg",
    date: "05 Sep 2023",
    amount: "$69,500",
    paid: "$10,500", 
    status: "Cash",
    paymentMode: "Cash"
  },
  {
    id: "INV00014",
    customer: "Mia Thompson",
    avatar: "/placeholder.svg",
    date: "02 Jan 2023",
    amount: "$33,230",
    paid: "$10,500",
    status: "Check",
    paymentMode: "Check"
  }
]

// Recent transactions
const recentTransactions = [
  {
    id: 1,
    name: "Andrew James",
    invoice: "#INV0077",
    amount: "+$5,553",
    type: "Income",
    status: "Pending"
  },
  {
    id: 2,
    name: "John Carter", 
    invoice: "#INV0077",
    amount: "-$6,653",
    type: "Expense",
    status: "Pending"
  },
  {
    id: 3,
    name: "Sophia White",
    invoice: "#INV0078",
    amount: "+$9,653",
    type: "Income",
    status: "Pending"
  },
  {
    id: 4,
    name: "David Martinez",
    invoice: "#INV0079",
    amount: "+$5,553",
    type: "Income",
    status: "Complete"
  },
  {
    id: 5,
    name: "Amelia Robinson",
    invoice: "#INV0080",
    amount: "+$6,553",
    type: "Income", 
    status: "Complete"
  }
]

// Quotations data
const quotationsData = [
  {
    id: 1,
    name: "Emily Clark",
    invoice: "QUO013",
    status: "Received",
    date: "25 May 2023",
    avatar: "/placeholder.svg"
  },
  {
    id: 2,
    name: "David Anderson",
    invoice: "QUO007",
    status: "Sent",
    date: "17 Nov 2023",
    avatar: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Sophia White",
    invoice: "QUO012",
    status: "Expired",
    date: "04 May 2023",
    avatar: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Michael Johnson",
    invoice: "QUO005",
    status: "Declined",
    date: "31 Jun 2023",
    avatar: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Emily Clark",
    invoice: "QUO018",
    status: "Received",
    date: "06 Jan 2023",
    avatar: "/placeholder.svg"
  }
]

// Top sales statistics (pie chart data)
const topSalesData = [
  { name: 'Duo Phone 5s', value: 25, color: '#8b5cf6' },
  { name: 'Yu Screen', value: 30, color: '#10b981' },
  { name: 'Apple iPhone 5s', value: 35, color: '#f59e0b' },
  { name: 'Other', value: 10, color: '#ef4444' }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header with Dashboard title and controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="ml-0 sm:ml-4 font-semibold text-lg sm:text-xl">
          Dashboard
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs border h-7 p-2 text-muted-foreground w-full sm:w-auto justify-center">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">14 Aug 25 - 14 Aug 25</span>
            <span className="sm:hidden">Aug 25</span>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 h-7 flex-1 sm:flex-none sm:w-24 gap-0 font-semibold text-center text-xs text-white">
              <span className="hidden sm:inline">Create New</span>
              <span className="sm:hidden">Create</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="text-gray-700 h-7 text-xs flex-1 sm:flex-none">
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded p-4 sm:p-6 text-white relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold mb-2">Good Morning, {greetingData.name}</h1>
            <p className="text-purple-100 mb-4 text-sm sm:text-base">{greetingData.message}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {greetingData.date}
              </span>
              <span>{greetingData.time}</span>
            </div>
          </div>
          <div className="hidden lg:block">
            <img 
              src="https://kanakku.dreamstechnologies.com/html/template/assets/img/icons/dashboard.svg"
              alt="Dashboard illustration" 
              className="h-32 w-auto"
            />
          </div>
        </div>
      </div>

      {/* Overview, Sales Analytics, and Invoice Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {overviewStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sales Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              Sales Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {salesAnalytics.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Invoice Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              Invoice Statistics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {invoiceStats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Products</p>
                <p className="text-2xl font-bold">697</p>
                <p className="text-sm text-green-600">+8.2%</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold">645</p>
                <p className="text-sm text-green-600">+16.24%</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Quotations</p>
                <p className="text-2xl font-bold">128</p>
                <p className="text-sm text-green-600">+11.02%</p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Revenue</CardTitle>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                <span>Revenue</span>
                <div className="h-3 w-3 bg-orange-500 rounded-full ml-4"></div>
                <span>Outstanding</span>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold">697 <span className="text-sm text-green-600 font-normal">+8.2%</span></p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Customers, Invoices, Recent Transactions, and Quotations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Customers */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Customers</CardTitle>
              <Button variant="link" className="text-blue-600 p-0">
                All Customers
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{customer.outstanding}</p>
                    <p className="text-sm text-orange-600">{customer.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Invoices</CardTitle>
              <Button variant="link" className="text-blue-600 p-0">
                View all Invoices
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Created On</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Amount</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Paid</th>
                    <th className="pb-3 text-sm font-medium text-muted-foreground">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.slice(0, 6).map((invoice) => (
                    <tr key={invoice.id} className="border-b">
                      <td className="py-3 text-sm font-medium">{invoice.id}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={invoice.avatar} />
                            <AvatarFallback className="text-xs">{invoice.customer.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{invoice.customer}</span>
                        </div>
                      </td>
                      <td className="py-3 text-sm">{invoice.date}</td>
                      <td className="py-3 text-sm font-medium">{invoice.amount}</td>
                      <td className="py-3 text-sm">{invoice.paid}</td>
                      <td className="py-3 text-sm">{invoice.paymentMode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions and Quotations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <p className="text-sm text-muted-foreground">Today</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${transaction.type === 'Income' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <User className={`h-4 w-4 ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.name}</p>
                      <p className="text-sm text-muted-foreground">{transaction.invoice}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${transaction.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount}
                    </p>
                    <Badge variant={transaction.status === 'Complete' ? 'default' : 'secondary'} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quotations and Top Sales Statistics */}
        <div className="space-y-6">
          {/* Quotations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Quotations</CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Total Value In Invoice</span>
                  <span className="font-bold">90.8</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quotationsData.map((quotation) => (
                  <div key={quotation.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={quotation.avatar} />
                        <AvatarFallback className="text-xs">{quotation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{quotation.name}</p>
                        <p className="text-sm text-muted-foreground">{quotation.invoice}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={quotation.status === 'Received' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          quotation.status === 'Received' ? 'bg-green-100 text-green-800' :
                          quotation.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                          quotation.status === 'Expired' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quotation.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{quotation.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Sales Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Top Sales Statistics</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span>📱 Duo Phone 5s</span>
                  <span>📺 Yu Screen</span>
                  <span>🍎 Apple iPhone 5s</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topSalesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {topSalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
