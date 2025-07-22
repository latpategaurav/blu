'use client'

import { useState, useMemo } from 'react';
import modelsData from '@/data/models.json';
import { ModelCard } from '@/components/model-image';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/navbar';
import type { ModelData } from '@/lib/data/moodboard-cache';

const MODELS_PER_PAGE = 12;

export default function ModelGalleryPage() {
  const [category, setCategory] = useState('all');
  const [agency, setAgency] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);

  // Get all unique categories and agencies
  const categories = useMemo(() => {
    const set = new Set<string>();
    (modelsData as ModelData[]).forEach((m) => m.modelCategory && set.add(m.modelCategory));
    return Array.from(set);
  }, []);
  const agencies = useMemo(() => {
    const set = new Set<string>();
    (modelsData as ModelData[]).forEach((m) => m.agency && set.add(m.agency));
    return Array.from(set);
  }, []);

  // Filtered models
  const filteredModels = useMemo(() => {
    return (modelsData as ModelData[]).filter((model) => {
      if (category !== 'all' && model.modelCategory !== category) return false;
      if (agency !== 'all' && model.agency !== agency) return false;
      if (search && !model.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [category, agency, search]);

  // Pagination
  const totalPages = Math.ceil(filteredModels.length / MODELS_PER_PAGE);
  const paginatedModels = filteredModels.slice((page - 1) * MODELS_PER_PAGE, page * MODELS_PER_PAGE);

  // Reset to page 1 on filter change
  const handleFilterChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-center">Model Gallery</h1>
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex gap-4 w-full md:w-auto">
              <select
                className="border rounded px-3 py-2 text-base"
                value={category}
                onChange={handleFilterChange(setCategory)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                className="border rounded px-3 py-2 text-base"
                value={agency}
                onChange={handleFilterChange(setAgency)}
              >
                <option value="all">All Agencies</option>
                {agencies.map((ag) => (
                  <option key={ag} value={ag}>{ag}</option>
                ))}
              </select>
            </div>
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
              className="max-w-xs"
            />
          </div>
          {/* Model Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {paginatedModels.map((model) => (
              <Dialog key={model.id} open={selectedModel?.id === model.id} onOpenChange={(open) => setSelectedModel(open ? model : null)}>
                <DialogTrigger asChild>
                  <div>
                    <ModelCard model={model} />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-full">
                  <DialogHeader>
                    <DialogTitle>{model.name}</DialogTitle>
                    <DialogDescription>{model.bio}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col md:flex-row gap-6 mt-4">
                    {/* Portfolio Images */}
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      {(model.images && model.images.length > 0 ? model.images : [null]).map((img, idx) => (
                        <div key={idx} className="aspect-[3/4] bg-gray-100 rounded overflow-hidden relative">
                          {img ? (
                            <img src={img} alt={model.name + ' portfolio'} className="object-cover w-full h-full" />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div><strong>Height:</strong> {model.height}</div>
                      <div><strong>Category:</strong> {model.modelCategory}</div>
                      <div><strong>Agency:</strong> {model.agency || 'N/A'}</div>
                      <div><strong>Rate/Day:</strong> ₹{model.ratePerDay?.toLocaleString() || 'N/A'}</div>
                      <div><strong>Instagram:</strong> {model.instagram ? <a href={model.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Profile</a> : 'N/A'}</div>
                      <div><strong>Contact:</strong> {model.contact || 'N/A'}</div>
                      <div><strong>Email:</strong> {model.email || 'N/A'}</div>
                      <div><strong>Location:</strong> {model.location || 'N/A'}</div>
                      <div><strong>Stats:</strong> {model.stats || 'N/A'}</div>
                      <div><strong>Shoe Size:</strong> {model.shoeSize || 'N/A'}</div>
                      <div><strong>Status:</strong> {model.status}</div>
                    </div>
                  </div>
                  <DialogClose asChild>
                    <Button className="mt-6 w-full">Close</Button>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <Button disabled={page === 1} onClick={() => setPage(page - 1)} variant="outline">Previous</Button>
            <span>Page {page} of {totalPages}</span>
            <Button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)} variant="outline">Next</Button>
          </div>
        </div>
      </div>
    </>
  );
} 