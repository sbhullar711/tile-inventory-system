"use client"

import React, { useState, useEffect } from 'react'
import { supabase, Tile } from '../lib/supabase'
import { Plus, Minus, Edit, Eye, LogOut } from 'lucide-react'

// Main App Component
export default function TileInventoryApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState('dashboard')
  const [tiles, setTiles] = useState<Tile[]>([])
  const [loading, setLoading] = useState(false)

  // Login Component
  const LoginForm = () => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = () => {
      // Check against environment variable password
      if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setIsAuthenticated(true)
        setError('')
      } else {
        setError('Invalid password')
      }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleLogin()
      }
    }

    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Tile Inventory System</h1>
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Load tiles from database
  const loadTiles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setTiles(data || [])
    } catch (error) {
      console.error('Error loading tiles:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadTiles()
    }
  }, [isAuthenticated])

  // Dashboard Component
  const Dashboard = () => (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Tile Inventory Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardButton
            icon={<Plus size={32} />}
            title="Add New Tiles"
            description="Add new tile inventory"
            onClick={() => setCurrentView('add')}
            color="bg-green-500 hover:bg-green-600"
          />
          <DashboardButton
            icon={<Minus size={32} />}
            title="Remove Tiles"
            description="Remove tiles when sold"
            onClick={() => setCurrentView('remove')}
            color="bg-red-500 hover:bg-red-600"
          />
          <DashboardButton
            icon={<Edit size={32} />}
            title="Update Inventory"
            description="Update existing tiles"
            onClick={() => setCurrentView('update')}
            color="bg-blue-500 hover:bg-blue-600"
          />
          <DashboardButton
            icon={<Eye size={32} />}
            title="View Tiles"
            description="View all tile inventory"
            onClick={() => setCurrentView('view')}
            color="bg-purple-500 hover:bg-purple-600"
          />
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{tiles.length}</div>
              <div className="text-gray-800">Total Tile Types</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tiles.reduce((sum, tile) => sum + tile.total_boxes, 0)}
              </div>
              <div className="text-gray-800">Total Boxes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {tiles.reduce((sum, tile) => sum + (tile.total_boxes * tile.sqft_per_box), 0).toFixed(0)}
              </div>
              <div className="text-gray-800">Total Sq Ft</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Dashboard Button Component
  const DashboardButton = ({ icon, title, description, onClick, color }: {
    icon: React.ReactNode
    title: string
    description: string
    onClick: () => void
    color: string
  }) => (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-lg shadow-lg transition-all transform hover:scale-105 text-center`}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  )

  // Add Tile Component
  const AddTileForm = () => {
    const [formData, setFormData] = useState({
      name: '',
      size: '',
      sqft_per_box: '',
      total_boxes: '',
      location: '',
      picture_url: ''
    })

    const handleSubmit = async () => {
      setLoading(true)
      
      try {
        const { error } = await supabase
          .from('tiles')
          .insert([{
            name: formData.name,
            size: formData.size,
            sqft_per_box: parseFloat(formData.sqft_per_box),
            total_boxes: parseInt(formData.total_boxes),
            location: formData.location,
            picture_url: formData.picture_url
          }])

        if (error) throw error
        
        await loadTiles()
        setCurrentView('dashboard')
        setFormData({ name: '', size: '', sqft_per_box: '', total_boxes: '', location: '', picture_url: '' })
      } catch (error) {
        console.error('Error adding tile:', error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <FormLayout title="Add New Tiles">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tile Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Size (e.g., 12x12 inch)"
              value={formData.size}
              onChange={(e) => setFormData({...formData, size: e.target.value})}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Sq Ft per Box"
              value={formData.sqft_per_box}
              onChange={(e) => setFormData({...formData, sqft_per_box: e.target.value})}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="number"
              placeholder="Number of Boxes"
              value={formData.total_boxes}
              onChange={(e) => setFormData({...formData, total_boxes: e.target.value})}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="border rounded-lg px-4 py-2"
            />
            <input
              type="url"
              placeholder="Picture URL (optional)"
              value={formData.picture_url}
              onChange={(e) => setFormData({...formData, picture_url: e.target.value})}
              className="border rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !formData.name || !formData.size || !formData.sqft_per_box || !formData.total_boxes}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Tiles'}
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormLayout>
    )
  }

  // Remove Tiles Component
  const RemoveTiles = () => {
    const [selectedTileId, setSelectedTileId] = useState('')
    const [boxesToRemove, setBoxesToRemove] = useState('')

    const handleRemove = async () => {
      if (!selectedTileId || !boxesToRemove) return

      const tile = tiles.find(t => t.id.toString() === selectedTileId)
      if (!tile) return

      const newBoxCount = tile.total_boxes - parseInt(boxesToRemove)
      
      setLoading(true)
      try {
        if (newBoxCount <= 0) {
          // Set to 0 instead of deleting
          const { error } = await supabase
            .from('tiles')
            .update({ total_boxes: 0 })
            .eq('id', selectedTileId)
          if (error) throw error
        } else {
          // Update box count
          const { error } = await supabase
            .from('tiles')
            .update({ total_boxes: newBoxCount })
            .eq('id', selectedTileId)
          if (error) throw error
        }
        
        await loadTiles()
        setSelectedTileId('')
        setBoxesToRemove('')
      } catch (error) {
        console.error('Error removing tiles:', error)
      } finally {
        setLoading(false)
      }
    }

    return (
      <FormLayout title="Remove Tiles">
        <div className="space-y-4 text-gray-800">
          <select
            value={selectedTileId}
            onChange={(e) => setSelectedTileId(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 text-gray-800"
            required
          >
            <option value="">Select a tile to remove</option>
            {tiles.map(tile => (
              <option key={tile.id} value={tile.id}>
                {tile.name} - {tile.total_boxes} boxes available
              </option>
            ))}
          </select>
          
          {selectedTileId && (
            <input
              type="number"
              min="1"
              max={tiles.find(t => t.id.toString() === selectedTileId)?.total_boxes}
              placeholder="Number of boxes to remove"
              value={boxesToRemove}
              onChange={(e) => setBoxesToRemove(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 text-gray-800"
              required
            />
          )}
          
          <div className="flex gap-4">
            <button
              onClick={handleRemove}
              disabled={loading || !selectedTileId || !boxesToRemove}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove Tiles'}
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormLayout>
    )
  }

  // Update Tiles Component
  const UpdateTiles = () => {
    const [selectedTileId, setSelectedTileId] = useState('')
    const [updateData, setUpdateData] = useState({
      total_boxes: '',
      location: '',
      picture_url: ''
    })

    const handleUpdate = async () => {
      setLoading(true)
      
      try {
        const updatePayload: Record<string, string | number> = {}
        if (updateData.total_boxes) updatePayload.total_boxes = parseInt(updateData.total_boxes)
        if (updateData.location) updatePayload.location = updateData.location
        if (updateData.picture_url) updatePayload.picture_url = updateData.picture_url

        const { error } = await supabase
          .from('tiles')
          .update(updatePayload)
          .eq('id', selectedTileId)

        if (error) throw error
        
        await loadTiles()
        setSelectedTileId('')
        setUpdateData({ total_boxes: '', location: '', picture_url: '' })
      } catch (error) {
        console.error('Error updating tile:', error)
      } finally {
        setLoading(false)
      }
    }

    const selectedTile = tiles.find(t => t.id.toString() === selectedTileId)

    return (
      <FormLayout title="Update Tile Inventory">
        <div className="space-y-4">
          <select
            value={selectedTileId}
            onChange={(e) => setSelectedTileId(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          >
            <option value="">Select a tile to update</option>
            {tiles.map(tile => (
              <option key={tile.id} value={tile.id}>
                {tile.name} - {tile.size}
              </option>
            ))}
          </select>
          
          {selectedTile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Current Details:</h3>
              <p>Boxes: {selectedTile.total_boxes}</p>
              <p>Location: {selectedTile.location || 'Not set'}</p>
            </div>
          )}
          
          {selectedTileId && (
            <div className="space-y-4">
              <input
                type="number"
                placeholder="New box count (leave blank to keep current)"
                value={updateData.total_boxes}
                onChange={(e) => setUpdateData({...updateData, total_boxes: e.target.value})}
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="text"
                placeholder="New location (leave blank to keep current)"
                value={updateData.location}
                onChange={(e) => setUpdateData({...updateData, location: e.target.value})}
                className="w-full border rounded-lg px-4 py-2"
              />
              <input
                type="url"
                placeholder="New picture URL (leave blank to keep current)"
                value={updateData.picture_url}
                onChange={(e) => setUpdateData({...updateData, picture_url: e.target.value})}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={handleUpdate}
              disabled={loading || !selectedTileId}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Tile'}
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </FormLayout>
    )
  }

  // View Tiles Component
  const ViewTiles = () => (
    <FormLayout title="View All Tiles">
      <div className="space-y-4 text-gray-800 ">
        {loading ? (
          <p>Loading tiles...</p>
        ) : tiles.length === 0 ? (
          <p>No tiles found. Add some tiles to get started!</p>
        ) : (
          <div className="grid gap-4">
            {tiles.map(tile => (
              <div key={tile.id} className="border rounded-lg p-4 bg-white shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{tile.name}</h3>
                    <p className="text-gray-900">Size: {tile.size}</p>
                    <p className="text-gray-900">Sq Ft per Box: {tile.sqft_per_box}</p>
                    <p className="text-gray-900">Total Boxes: <span className="font-semibold text-blue-600">{tile.total_boxes}</span></p>
                    <p className="text-gray-900">Total Sq Ft: <span className="font-semibold text-green-600">{(tile.total_boxes * tile.sqft_per_box).toFixed(2)}</span></p>
                    <p className="text-gray-900">Location: {tile.location || 'Not specified'}</p>
                    <p className="text-xs text-gray-500">Added: {new Date(tile.created_at).toLocaleDateString()}</p>
                  </div>
                  {tile.picture_url && (
                    <div className="w-74 h-44 bg-gray-200 rounded-lg ml-4 flex items-center justify-center overflow-hidden">
                      <img 
                        src={tile.picture_url} 
                        alt={tile.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          if (target.parentElement) {
                            target.parentElement.innerHTML = '<div class="text-xs text-gray-500">No Image</div>';
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setCurrentView('dashboard')}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>
    </FormLayout>
  )

  // Form Layout Component
  const FormLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
          {children}
        </div>
      </div>
    </div>
  )

  // Main render logic
  if (!isAuthenticated) {
    return <LoginForm />
  }

  switch (currentView) {
    case 'add':
      return <AddTileForm />
    case 'remove':
      return <RemoveTiles />
    case 'update':
      return <UpdateTiles />
    case 'view':
      return <ViewTiles />
    default:
      return <Dashboard />
  }
}