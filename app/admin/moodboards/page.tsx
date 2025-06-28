/**
 * Admin Moodboards Management Page
 * Provides CRUD operations for moodboards
 * Allows admins to create, edit, view, and delete moodboards
 */

'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { Plus, Edit, Trash2, Search, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Moodboard } from '@/types/database'

/**
 * Moodboards Management Component
 * Features:
 * - List view with search/filter
 * - Create new moodboards
 * - Edit existing moodboards
 * - Toggle active/booked status
 * - Delete moodboards
 */
export default function AdminMoodboardsPage() {
  // State management
  const [moodboards, setMoodboards] = useState<Moodboard[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingMoodboard, setEditingMoodboard] = useState<Moodboard | null>(null)
  
  // Form state for create/edit operations
  const [formData, setFormData] = useState({
    title: '',
    tags: '',          // Comma-separated string, converted to array
    liner: '',
    date: '',
    model_count: 1,
    is_active: true,
    is_booked: false
  })

  // Fetch moodboards on component mount
  useEffect(() => {
    fetchMoodboards()
  }, [])

  /**
   * Fetches all moodboards from database
   * Ordered by date in descending order
   */
  const fetchMoodboards = async () => {
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from('moodboards')
      .select('*')
      .order('date', { ascending: false })

    if (!error && data) {
      setMoodboards(data)
    }
    setLoading(false)
  }

  /**
   * Creates a new moodboard
   * Validates required fields and formats data
   */
  const handleCreate = async () => {
    if (!formData.title || !formData.date) {
      toast.error('Title and date are required')
      return
    }

    const supabase = createClient()
    
    // Parse tags from comma-separated string
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const { error } = await supabase
      .from('moodboards')
      .insert({
        title: formData.title,
        tags: tagsArray,
        liner: formData.liner || null,
        date: formData.date,
        model_count: formData.model_count,
        is_active: formData.is_active,
        is_booked: formData.is_booked
      })

    if (!error) {
      toast.success('Moodboard created successfully')
      setIsCreateOpen(false)
      resetForm()
      fetchMoodboards() // Refresh list
    } else {
      toast.error('Failed to create moodboard')
    }
  }

  /**
   * Updates an existing moodboard
   * Preserves existing data while applying changes
   */
  const handleUpdate = async () => {
    if (!editingMoodboard || !formData.title || !formData.date) {
      toast.error('Title and date are required')
      return
    }

    const supabase = createClient()
    
    // Parse tags from comma-separated string
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const { error } = await supabase
      .from('moodboards')
      .update({
        title: formData.title,
        tags: tagsArray,
        liner: formData.liner || null,
        date: formData.date,
        model_count: formData.model_count,
        is_active: formData.is_active,
        is_booked: formData.is_booked
      })
      .eq('id', editingMoodboard.id)

    if (!error) {
      toast.success('Moodboard updated successfully')
      setEditingMoodboard(null)
      resetForm()
      fetchMoodboards() // Refresh list
    } else {
      toast.error('Failed to update moodboard')
    }
  }

  /**
   * Deletes a moodboard after confirmation
   * @param id - Moodboard ID to delete
   */
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this moodboard?')) {
      return
    }

    const supabase = createClient()
    
    const { error } = await supabase
      .from('moodboards')
      .delete()
      .eq('id', id)

    if (!error) {
      toast.success('Moodboard deleted successfully')
      fetchMoodboards() // Refresh list
    } else {
      toast.error('Failed to delete moodboard')
    }
  }

  /**
   * Toggles active status of a moodboard
   * Quick action without opening edit dialog
   * @param id - Moodboard ID
   * @param currentStatus - Current active status
   */
  const toggleActive = async (id: string, currentStatus: boolean) => {
    const supabase = createClient()
    
    const { error } = await supabase
      .from('moodboards')
      .update({ is_active: !currentStatus })
      .eq('id', id)

    if (!error) {
      toast.success(`Moodboard ${!currentStatus ? 'activated' : 'deactivated'}`)
      fetchMoodboards() // Refresh list
    }
  }

  /**
   * Opens edit dialog with pre-filled data
   * @param moodboard - Moodboard to edit
   */
  const startEdit = (moodboard: Moodboard) => {
    setEditingMoodboard(moodboard)
    setFormData({
      title: moodboard.title,
      tags: moodboard.tags?.join(', ') || '',
      liner: moodboard.liner || '',
      date: moodboard.date || '',
      model_count: moodboard.model_count ?? 1,
      is_active: moodboard.is_active,
      is_booked: moodboard.is_booked ?? false
    })
  }

  /**
   * Resets form to initial state
   */
  const resetForm = () => {
    setFormData({
      title: '',
      tags: '',
      liner: '',
      date: '',
      model_count: 1,
      is_active: true,
      is_booked: false
    })
  }

  /**
   * Filters moodboards based on search term
   * Searches in title, tags, and liner
   */
  const filteredMoodboards = moodboards.filter(mb => 
    mb.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mb.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    mb.liner?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Moodboards</h1>
        <div className="h-96 bg-zinc-100 rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Moodboards</h1>
          <p className="text-zinc-600 mt-1">Manage mood board listings</p>
        </div>
        
        {/* Create New Button */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Create Moodboard
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Moodboard</DialogTitle>
              <DialogDescription>
                Add a new mood board to the calendar
              </DialogDescription>
            </DialogHeader>
            {/* Create Form */}
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summer Vibes"
                />
              </div>
              
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="casual, outdoor, summer"
                />
              </div>
              
              <div>
                <Label htmlFor="liner">Liner (optional)</Label>
                <Textarea
                  id="liner"
                  value={formData.liner}
                  onChange={(e) => setFormData({ ...formData, liner: e.target.value })}
                  placeholder="One-line description"
                  rows={2}
                />
              </div>
              
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="model_count">Model Count</Label>
                <Input
                  id="model_count"
                  type="number"
                  min="1"
                  value={formData.model_count}
                  onChange={(e) => setFormData({ ...formData, model_count: parseInt(e.target.value) || 1 })}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>
                  Create Moodboard
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search moodboards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Moodboards List */}
      <div className="grid gap-4">
        {filteredMoodboards.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-zinc-500">No moodboards found</p>
            </CardContent>
          </Card>
        ) : (
          filteredMoodboards.map((moodboard) => (
            <Card key={moodboard.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Moodboard Title and Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{moodboard.title}</h3>
                      <Badge variant={moodboard.is_active ? 'default' : 'secondary'}>
                        {moodboard.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {moodboard.is_booked && (
                        <Badge variant="outline">Booked</Badge>
                      )}
                    </div>
                    
                    {/* Moodboard Details */}
                    {moodboard.liner && (
                      <p className="text-sm text-zinc-600 mb-2">{moodboard.liner}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(moodboard.date || '1970-01-01'), 'MMM d, yyyy')}
                      </div>
                      <span>Models: {moodboard.model_count}</span>
                    </div>
                    
                    {/* Tags */}
                    {moodboard.tags && moodboard.tags.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {moodboard.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={moodboard.is_active}
                      onCheckedChange={() => toggleActive(moodboard.id, moodboard.is_active)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEdit(moodboard)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(moodboard.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingMoodboard} onOpenChange={() => setEditingMoodboard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Moodboard</DialogTitle>
            <DialogDescription>
              Update moodboard details
            </DialogDescription>
          </DialogHeader>
          {/* Edit Form - Same fields as create */}
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-tags">Tags (comma-separated)</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-liner">Liner (optional)</Label>
              <Textarea
                id="edit-liner"
                value={formData.liner}
                onChange={(e) => setFormData({ ...formData, liner: e.target.value })}
                rows={2}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-date">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-model_count">Model Count</Label>
              <Input
                id="edit-model_count"
                type="number"
                min="1"
                value={formData.model_count}
                onChange={(e) => setFormData({ ...formData, model_count: parseInt(e.target.value) || 1 })}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="edit-is_active">Active</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_booked"
                checked={formData.is_booked}
                onCheckedChange={(checked) => setFormData({ ...formData, is_booked: checked })}
              />
              <Label htmlFor="edit-is_booked">Booked</Label>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditingMoodboard(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update Moodboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 