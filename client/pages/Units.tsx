import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Ruler,
  Package,
  TrendingUp,
  BarChart3
} from "lucide-react"

interface Unit {
  id: number
  name: string
  short_name: string
  description: string
  created_at: string
}

export default function Units() {
  const [units, setUnits] = useState<Unit[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedUnits, setSelectedUnits] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null)
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({})

  // Fetch units from API
  const fetchUnits = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/units')
      const data = await response.json()
      if (data.success) {
        setUnits(data.data)
      }
    } catch (error) {
      console.error('Error fetching units:', error)
      alert('Failed to fetch units')
    } finally {
      setIsLoading(false)
    }
  }

  // Load units on component mount
  useEffect(() => {
    fetchUnits()
  }, [])

  const stats = {
    totalUnits: units.length,
    activeUnits: units.length, // All units are considered active for now
    totalUsage: 0, // Placeholder
    unitTypes: 1 // Placeholder
  }

  const toggleUnitSelection = (unitId: number) => {
    setSelectedUnits(prev =>
      prev.includes(unitId.toString())
        ? prev.filter(id => id !== unitId.toString())
        : [...prev, unitId.toString()]
    )
  }

  const toggleSelectAll = () => {
    setSelectedUnits(prev =>
      prev.length === filteredUnits.length ? [] : filteredUnits.map(u => u.id.toString())
    )
  }

  const filteredUnits = units.filter(unit => {
    const matchesSearch = unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         unit.short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         unit.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesSearch
  })

  const handleAddUnit = async () => {
    if (!newUnit.name || !newUnit.short_name || !newUnit.description) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)

      const unitData = {
        name: newUnit.name,
        short_name: newUnit.short_name,
        description: newUnit.description || ''
      }

      const response = await fetch('/api/units', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData)
      })

      const data = await response.json()

      if (data.success) {
        alert(`${newUnit.name} unit has been added successfully`)
        setNewUnit({})
        setIsAddDialogOpen(false)
        fetchUnits() // Refresh the unit list
      } else {
        alert(data.message || 'Failed to create unit')
      }
    } catch (error) {
      console.error('Error creating unit:', error)
      alert('Failed to create unit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUnit = (unit: Unit) => {
    setEditingUnit(unit)
    setNewUnit({
      name: unit.name,
      short_name: unit.short_name,
      description: unit.description
    })
    setIsAddDialogOpen(true)
  }

  const handleUpdateUnit = async () => {
    if (!editingUnit || !newUnit.name || !newUnit.short_name || !newUnit.description) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setIsSubmitting(true)

      const unitData = {
        name: newUnit.name,
        short_name: newUnit.short_name,
        description: newUnit.description || ''
      }

      const response = await fetch(`/api/units/${editingUnit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData)
      })

      const data = await response.json()

      if (data.success) {
        alert(`${newUnit.name} unit has been updated successfully`)
        setEditingUnit(null)
        setNewUnit({})
        setIsAddDialogOpen(false)
        fetchUnits() // Refresh the unit list
      } else {
        alert(data.message || 'Failed to update unit')
      }
    } catch (error) {
      console.error('Error updating unit:', error)
      alert('Failed to update unit')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUnit = async (unitId: number) => {
    const unit = units.find(u => u.id === unitId)
    if (!unit || !confirm(`Are you sure you want to delete ${unit.name}?`)) {
      return
    }

    try {
      const response = await fetch(`/api/units/${unitId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert(`${unit.name} unit has been deleted successfully`)
        fetchUnits() // Refresh the unit list
      } else {
        alert(data.message || 'Failed to delete unit')
      }
    } catch (error) {
      console.error('Error deleting unit:', error)
      alert('Failed to delete unit')
    }
  }

  const handleDeleteSelected = async () => {
    if (selectedUnits.length === 0 || !confirm(`Are you sure you want to delete ${selectedUnits.length} units?`)) {
      return
    }

    try {
      for (const unitId of selectedUnits) {
        await fetch(`/api/units/${unitId}`, {
          method: 'DELETE'
        })
      }
      setSelectedUnits([])
      fetchUnits() // Refresh the unit list
      alert('Selected units have been deleted successfully')
    } catch (error) {
      console.error('Error deleting units:', error)
      alert('Failed to delete units')
    }
  }

  const getTypeColor = (type: string) => {
    const colors = {
      Weight: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      Length: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
      Volume: "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
      Quantity: "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
      Time: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
      Other: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
    }
    return colors[type as keyof typeof colors] || colors.Other
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Units of Measurement</h1>
          <p className="text-muted-foreground">Manage units for your products and services</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedUnits.length > 0 && (
            <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected ({selectedUnits.length})
            </Button>
          )}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                setEditingUnit(null)
                setNewUnit({})
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Unit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingUnit ? "Edit Unit" : "Add New Unit"}</DialogTitle>
                <DialogDescription>
                  {editingUnit ? "Update the unit information" : "Create a new unit of measurement"}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Unit Name</Label>
                    <Input
                      id="name"
                      value={newUnit.name || ""}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Kilogram"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shortName">Short Name</Label>
                    <Input
                      id="shortName"
                      value={newUnit.short_name || ""}
                      onChange={(e) => setNewUnit(prev => ({ ...prev, short_name: e.target.value }))}
                      placeholder="e.g., kg"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newUnit.description || ""}
                    onChange={(e) => setNewUnit(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter unit description"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingUnit ? handleUpdateUnit : handleAddUnit}>
                  {editingUnit ? "Update Unit" : "Add Unit"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Units
            </CardTitle>
            <Ruler className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Units
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUnits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Unit Types
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unitTypes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usage
            </CardTitle>
            <Package className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsage}</div>
          </CardContent>
        </Card>
      </div>

      {/* Units Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle>Units</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full lg:w-60"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 w-12">
                    <Checkbox 
                      checked={selectedUnits.length === filteredUnits.length && filteredUnits.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Unit Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Short Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Usage Count</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <Checkbox 
                        checked={selectedUnits.includes(unit.id.toString())}
                        onCheckedChange={() => toggleUnitSelection(unit.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{unit.name}</div>
                        <div className="text-sm text-muted-foreground">{unit.description}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-mono font-medium">{unit.short_name}</td>
                    <td className="p-4">
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-0">
                        General
                      </Badge>
                    </td>
                    <td className="p-4 text-sm font-medium">0</td>
                    <td className="p-4">
                      <Badge variant="default">
                        Active
                      </Badge>
                    </td>
                    <td className="p-4 text-sm">{new Date(unit.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditUnit(unit)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteUnit(unit.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
