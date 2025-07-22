'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Navbar } from '@/components/navbar';

export default function AdminModelsPage() {
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    modelCategory: '',
    bio: '',
    height: '',
    agency: '',
    ratePerDay: '',
    available: true,
    images: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.from('models').select('*').order('name');
    if (!error && data) setModels(data);
    setLoading(false);
  };

  const handleOpenDialog = (model: any = null) => {
    setEditingModel(model);
    setFormData(model ? {
      name: model.name || '',
      modelCategory: model.modelCategory || '',
      bio: model.bio || '',
      height: model.height || '',
      agency: model.agency || '',
      ratePerDay: model.ratePerDay || '',
      available: model.available !== undefined ? model.available : true,
      images: model.images || [],
    } : {
      name: '', modelCategory: '', bio: '', height: '', agency: '', ratePerDay: '', available: true, images: [],
    });
    setImageFiles([]);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingModel(null);
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e: any) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const supabase = createClient();
    let uploadedImages = formData.images || [];
    if (imageFiles.length > 0) {
      for (const file of imageFiles) {
        const { data, error } = await supabase.storage.from('model-portfolios').upload(`public/${Date.now()}-${file.name}`, file);
        if (!error && data) {
          const url = supabase.storage.from('model-portfolios').getPublicUrl(data.path).data.publicUrl;
          uploadedImages.push(url);
        }
      }
    }
    if (editingModel) {
      await supabase.from('models').update({ ...formData, images: uploadedImages }).eq('id', editingModel.id);
    } else {
      await supabase.from('models').insert([{ ...formData, images: uploadedImages }]);
    }
    fetchModels();
    handleCloseDialog();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this model?')) return;
    const supabase = createClient();
    await supabase.from('models').delete().eq('id', id);
    fetchModels();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-12 px-4 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Model Management</h1>
          <Button onClick={() => handleOpenDialog()}>Add Model</Button>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader>
                  <CardTitle>{model.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Category:</strong> {model.modelCategory}</div>
                  <div><strong>Height:</strong> {model.height}</div>
                  <div><strong>Agency:</strong> {model.agency}</div>
                  <div><strong>Rate/Day:</strong> ₹{model.ratePerDay}</div>
                  <div><strong>Available:</strong> {model.available ? 'Yes' : 'No'}</div>
                  <div><strong>Portfolio:</strong> {model.images && model.images.length > 0 ? (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {model.images.map((img: string, idx: number) => (
                        <img key={idx} src={img} alt="Portfolio" className="w-16 h-20 object-cover rounded" />
                      ))}
                    </div>
                  ) : 'No images'}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={() => handleOpenDialog(model)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(model.id)}>Delete</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg w-full">
            <DialogHeader>
              <DialogTitle>{editingModel ? 'Edit Model' : 'Add Model'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input name="name" value={formData.name} onChange={handleInputChange} required />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input name="modelCategory" value={formData.modelCategory} onChange={handleInputChange} required />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea name="bio" value={formData.bio} onChange={handleInputChange} required />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Height</FormLabel>
                <FormControl>
                  <Input name="height" value={formData.height} onChange={handleInputChange} required />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Agency</FormLabel>
                <FormControl>
                  <Input name="agency" value={formData.agency} onChange={handleInputChange} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Rate Per Day</FormLabel>
                <FormControl>
                  <Input name="ratePerDay" value={formData.ratePerDay} onChange={handleInputChange} type="number" min="0" />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Available</FormLabel>
                <FormControl>
                  <Switch checked={formData.available} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))} />
                </FormControl>
              </FormItem>
              <FormItem>
                <FormLabel>Portfolio Images</FormLabel>
                <FormControl>
                  <Input type="file" multiple accept="image/*" onChange={handleImageChange} />
                </FormControl>
              </FormItem>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit">{editingModel ? 'Update' : 'Add'}</Button>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
} 