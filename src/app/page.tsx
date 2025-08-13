'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardAction, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus, Save, X, Building, MapPin, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import Navbar from '@/components/navbar';
import { mockProperties } from '@/lib/mock-data';

type Property = {
  id: string;
  name: string;
  city: string;
  state: string;
  rooms: number;
  adr: number;
  occupancy: number; // 0..1
  revpar: number;
  createdAt: string;
};

export default function Home() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  // form state
  const [form, setForm] = useState({
    name: '',
    city: '',
    state: 'GA',
    rooms: 100,
    adr: 150,
    occupancy: 0.7,
    revpar: 105,
  });

  // edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    city: '',
    state: '',
    rooms: 0,
    adr: 0,
    occupancy: 0,
    revpar: 0,
  });

  // Fetch properties using React Query with fallback to mock data
  const { data: list = [], isLoading: loading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/properties');
        if (!res.ok) throw new Error('Failed to fetch properties');
        return res.json();
      } catch (error) {
        console.warn('API failed, using mock data:', error);
        // Return mock data if API fails
        return mockProperties;
      }
    },
    retry: false, // Don't retry failed requests, just use mock data
  });

  // Create property mutation
  const createMutation = useMutation({
    mutationFn: async (data: typeof form) => {
    const res = await fetch('/api/properties', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          ...data,
          rooms: Number(data.rooms),
          adr: Number(data.adr),
          occupancy: Number(data.occupancy),
          revpar: Number(data.revpar),
      }),
    });
    if (!res.ok) {
      const errBody = await res.json();
        console.error('Create error:', errBody);
        throw new Error(errBody.error || 'Create failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setForm({ name: '', city: '', state: 'GA', rooms: 100, adr: 150, occupancy: 0.7, revpar: 105 });
      toast.success('Property created successfully! 🎉');
    },
    onError: (error) => {
      console.error('Create mutation error:', error);
      toast.error(error.message || 'Failed to create property');
    },
  });

  // Update property mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof editForm }) => {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          rooms: Number(data.rooms),
          adr: Number(data.adr),
          occupancy: Number(data.occupancy),
          revpar: Number(data.revpar),
        }),
      });
      if (!res.ok) {
        await res.json();
        throw new Error('Update failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      setEditingId(null);
      toast.success('Property updated successfully! ✨');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update property');
    },
  });

  // Delete property mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        await res.json();
        throw new Error('Delete failed');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Property deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete property');
    },
  });

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset any previous errors
    createMutation.reset();
    createMutation.mutate(form);
  };

  const startEdit = (property: Property) => {
    setEditingId(property.id);
    setEditForm({
      name: property.name,
      city: property.city,
      state: property.state,
      rooms: property.rooms,
      adr: property.adr,
      occupancy: property.occupancy,
      revpar: property.revpar,
    });
  };

  const saveEdit = () => {
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: editForm });
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const deleteProperty = (id: string) => {
    deleteMutation.mutate(id);
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(0)}`;
  const formatPercentage = (decimal: number) => `${(decimal * 100).toFixed(0)}%`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-6 py-8 max-w-6xl" id="properties">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Properties</h2>
            <p className="text-muted-foreground">Manage your hotel properties with ease</p>
            {list === mockProperties && (
              <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200">
                📊 Using demo data (database not connected)
              </div>
            )}
          </div>

        {/* Create Property Form */}
        <Card className="mb-8 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Property
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Property Name</Label>
                <Input
                  id="name"
                  placeholder="Enter property name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">City</Label>
                <Input
                  id="city"
                  placeholder="Enter city"
                  value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium">State</Label>
                <Input
                  id="state"
                  placeholder="e.g. GA"
                  value={form.state}
                  onChange={e => setForm({ ...form, state: e.target.value.toUpperCase().slice(0,2) })}
                  required
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rooms" className="text-sm font-medium">Rooms</Label>
                <Input
                  id="rooms"
                  type="number"
                  placeholder="100"
                  value={form.rooms}
                  onChange={e => setForm({ ...form, rooms: Number(e.target.value) })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adr" className="text-sm font-medium">ADR ($)</Label>
                <Input
                  id="adr"
                  type="number"
                  step="0.01"
                  placeholder="150.00"
                  value={form.adr}
                  onChange={e => setForm({ ...form, adr: Number(e.target.value) })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="occupancy" className="text-sm font-medium">Occupancy (0-1)</Label>
                <Input
                  id="occupancy"
                  type="number"
                  step="0.01"
                  placeholder="0.70"
                  value={form.occupancy}
                  onChange={e => setForm({ ...form, occupancy: Number(e.target.value) })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="revpar" className="text-sm font-medium">RevPAR ($)</Label>
                <Input
                  id="revpar"
                  type="number"
                  step="0.01"
                  placeholder="105.00"
                  value={form.revpar}
                  onChange={e => setForm({ ...form, revpar: Number(e.target.value) })}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  {createMutation.isPending ? 'Adding...' : 'Add Property'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Properties List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-muted-foreground">Loading properties...</span>
          </div>
        ) : list.length === 0 ? (
          <Card className="text-center py-12 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent>
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">No properties yet</h3>
              <p className="text-muted-foreground">Add your first property to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((property: Property) => (
              <Card key={property.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm hover:scale-[1.02]">
                {editingId === property.id ? (
                  // Edit Mode
                  <>
                    <CardHeader>
                      <CardTitle className="text-lg">Edit Property</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor={`edit-name-${property.id}`} className="text-xs">Name</Label>
                          <Input
                            id={`edit-name-${property.id}`}
                            value={editForm.name}
                            onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-city-${property.id}`} className="text-xs">City</Label>
                          <Input
                            id={`edit-city-${property.id}`}
                            value={editForm.city}
                            onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-state-${property.id}`} className="text-xs">State</Label>
                          <Input
                            id={`edit-state-${property.id}`}
                            value={editForm.state}
                            onChange={e => setEditForm({ ...editForm, state: e.target.value.toUpperCase().slice(0,2) })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-rooms-${property.id}`} className="text-xs">Rooms</Label>
                          <Input
                            id={`edit-rooms-${property.id}`}
                            type="number"
                            value={editForm.rooms}
                            onChange={e => setEditForm({ ...editForm, rooms: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-adr-${property.id}`} className="text-xs">ADR</Label>
                          <Input
                            id={`edit-adr-${property.id}`}
                            type="number"
                            step="0.01"
                            value={editForm.adr}
                            onChange={e => setEditForm({ ...editForm, adr: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edit-occupancy-${property.id}`} className="text-xs">Occupancy</Label>
                          <Input
                            id={`edit-occupancy-${property.id}`}
                            type="number"
                            step="0.01"
                            value={editForm.occupancy}
                            onChange={e => setEditForm({ ...editForm, occupancy: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label htmlFor={`edit-revpar-${property.id}`} className="text-xs">RevPAR</Label>
                          <Input
                            id={`edit-revpar-${property.id}`}
                            type="number"
                            step="0.01"
                            value={editForm.revpar}
                            onChange={e => setEditForm({ ...editForm, revpar: Number(e.target.value) })}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button 
                        onClick={saveEdit}
                        disabled={updateMutation.isPending}
                        size="sm"
                        className="flex-1"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {updateMutation.isPending ? 'Saving...' : 'Save'}
                      </Button>
                      <Button 
                        onClick={cancelEdit}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </CardFooter>
                  </>
                ) : (
                  // View Mode
                  <>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-1">{property.name}</CardTitle>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm">{property.city}, {property.state}</span>
                          </div>
                        </div>
                        <CardAction>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              onClick={() => startEdit(property)}
                              variant="outline"
                              size="sm"
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-red-50 hover:border-red-300"
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Property</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete &ldquo;{property.name}&rdquo;? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteProperty(property.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardAction>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Rooms</div>
                            <div className="font-semibold">{property.rooms}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">ADR</div>
                            <div className="font-semibold">{formatCurrency(property.adr)}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">Occupancy</div>
                            <Badge variant="secondary" className="font-semibold">
                              {formatPercentage(property.occupancy)}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm text-muted-foreground">RevPAR</div>
                            <div className="font-semibold text-green-600">{formatCurrency(property.revpar)}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Added {new Date(property.createdAt).toLocaleDateString()}
                    </CardFooter>
                  </>
                )}
              </Card>
            ))}
          </div>
        )}
        </div>
    </main>
    </>
  );
}