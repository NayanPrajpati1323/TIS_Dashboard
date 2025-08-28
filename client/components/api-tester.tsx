import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock, RefreshCw } from "lucide-react"

interface TestResult {
  name: string
  url: string
  status: 'pending' | 'success' | 'error'
  message: string
  recordCount?: number
}

const API_ENDPOINTS = [
  { name: 'Health Check', url: '/api/health' },
  { name: 'Customers', url: '/api/customers' },
  { name: 'Invoices', url: '/api/invoices' },
  { name: 'Quotations', url: '/api/quotations' },
  { name: 'Categories', url: '/api/categories' },
  { name: 'Products', url: '/api/products' },
  { name: 'Units', url: '/api/units' },
  { name: 'Dashboard Stats', url: '/api/dashboard/stats' }
]

export function ApiTester() {
  const [results, setResults] = useState<TestResult[]>(
    API_ENDPOINTS.map(endpoint => ({
      ...endpoint,
      status: 'pending' as const,
      message: 'Not tested'
    }))
  )
  const [isRunning, setIsRunning] = useState(false)

  const testSingleEndpoint = async (endpoint: typeof API_ENDPOINTS[0]): Promise<TestResult> => {
    try {
      const response = await fetch(endpoint.url)
      const data = await response.json()
      
      if (response.ok && data.success) {
        const recordCount = data.data 
          ? (Array.isArray(data.data) ? data.data.length : 1) 
          : 0
        
        return {
          ...endpoint,
          status: 'success',
          message: `OK (${recordCount} records)`,
          recordCount
        }
      } else {
        return {
          ...endpoint,
          status: 'error',
          message: data.error || data.message || 'Unknown error'
        }
      }
    } catch (error) {
      return {
        ...endpoint,
        status: 'error',
        message: error instanceof Error ? error.message : 'Connection failed'
      }
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    
    for (let i = 0; i < API_ENDPOINTS.length; i++) {
      const endpoint = API_ENDPOINTS[i]
      
      // Update status to pending for current test
      setResults(prev => prev.map((result, index) => 
        index === i 
          ? { ...result, status: 'pending' as const, message: 'Testing...' }
          : result
      ))
      
      // Run the test
      const result = await testSingleEndpoint(endpoint)
      
      // Update with result
      setResults(prev => prev.map((prevResult, index) => 
        index === i ? result : prevResult
      ))
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsRunning(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-400" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-700">Success</Badge>
      case 'error':
        return <Badge className="bg-red-100 text-red-700">Error</Badge>
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700">Pending</Badge>
      default:
        return null
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const totalRecords = results.reduce((sum, r) => sum + (r.recordCount || 0), 0)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">API Endpoint Tester</CardTitle>
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning && <RefreshCw className="h-4 w-4 animate-spin" />}
            {isRunning ? 'Running Tests...' : 'Run All Tests'}
          </Button>
        </div>
        
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
            <div className="text-sm text-muted-foreground">Successful</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{errorCount}</div>
            <div className="text-sm text-muted-foreground">Failed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalRecords}</div>
            <div className="text-sm text-muted-foreground">Total Records</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div 
              key={result.name} 
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(result.status)}
                <div>
                  <div className="font-medium">{result.name}</div>
                  <div className="text-sm text-muted-foreground font-mono">{result.url}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{result.message}</span>
                {getStatusBadge(result.status)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">How to Use:</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Click "Run All Tests" to test all API endpoints</li>
            <li>• Green indicates successful API calls with data</li>
            <li>• Red indicates API errors or connection failures</li>
            <li>• Record counts show how much data is available</li>
            <li>• Make sure the server is running on port 3000</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
