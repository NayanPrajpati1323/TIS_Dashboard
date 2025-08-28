import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  title?: string
  filename?: string
}

export interface ImportResult<T = any> {
  data: T[]
  errors: string[]
  success: boolean
}

// Excel Export
export function exportToExcel(data: ExportData): void {
  try {
    const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows])
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    
    const filename = data.filename || 'export'
    XLSX.writeFile(wb, `${filename}.xlsx`)
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    throw new Error('Failed to export to Excel')
  }
}

// PDF Export
export function exportToPDF(data: ExportData): void {
  try {
    const doc = new jsPDF()

    // Add title
    if (data.title) {
      doc.setFontSize(16)
      doc.text(data.title, 20, 20)
    }

    // Add table using autoTable
    autoTable(doc, {
      head: [data.headers],
      body: data.rows,
      startY: data.title ? 30 : 20,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [124, 58, 237], // Purple color
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      }
    })

    const filename = data.filename || 'export'
    doc.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw new Error('Failed to export to PDF')
  }
}

// Excel Import
export function importFromExcel<T = any>(
  file: File,
  transform?: (row: any[]) => T
): Promise<ImportResult<T>> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        const errors: string[] = []
        const processedData: T[] = []
        
        // Skip header row
        const rows = jsonData.slice(1) as any[][]
        
        rows.forEach((row, index) => {
          try {
            if (transform) {
              const transformed = transform(row)
              processedData.push(transformed)
            } else {
              processedData.push(row as T)
            }
          } catch (error) {
            errors.push(`Row ${index + 2}: ${error instanceof Error ? error.message : 'Invalid data'}`)
          }
        })
        
        resolve({
          data: processedData,
          errors,
          success: errors.length === 0
        })
      } catch (error) {
        reject(new Error('Failed to parse Excel file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

// CSV Export (alternative)
export function exportToCSV(data: ExportData): void {
  try {
    const csvContent = [
      data.headers.join(','),
      ...data.rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${data.filename || 'export'}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    throw new Error('Failed to export to CSV')
  }
}

// Template generators for different data types
export const generateInvoiceData = (invoices: any[]): ExportData => ({
  headers: ['Invoice #', 'Customer', 'Date', 'Due Date', 'Amount', 'Status'],
  rows: invoices.map(invoice => [
    invoice.number,
    invoice.customer,
    invoice.date,
    invoice.dueDate,
    invoice.amount,
    invoice.status
  ]),
  title: 'Invoices Report',
  filename: 'invoices-report'
})

export const generateProductData = (products: any[]): ExportData => ({
  headers: ['Name', 'SKU', 'Category', 'Price', 'Stock', 'Status'],
  rows: products.map(product => [
    product.name,
    product.sku,
    product.category,
    product.price,
    product.stock,
    product.status
  ]),
  title: 'Products Report',
  filename: 'products-report'
})

export const generateCustomerData = (customers: any[]): ExportData => ({
  headers: ['Name', 'Email', 'Phone', 'Company', 'Created Date'],
  rows: customers.map(customer => [
    customer.name,
    customer.email,
    customer.phone,
    customer.company,
    customer.createdAt
  ]),
  title: 'Customers Report',
  filename: 'customers-report'
})

