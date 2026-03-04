'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Pencil, FolderOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Collection {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

async function fetchCollections(): Promise<Collection[]> {
  const res = await fetch('/api/v1/collections');
  if (!res.ok) throw new Error('Failed to fetch collections');
  const json = await res.json();
  return json.data;
}

async function createCollectionApi(data: { name: string }) {
  const res = await fetch('/api/v1/collections', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Failed to create collection');
  }
  return res.json();
}

async function deleteCollectionApi(id: string) {
  const res = await fetch(`/api/v1/collections/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete collection');
  return res.json();
}

async function renameCollectionApi(id: string, name: string) {
  const res = await fetch(`/api/v1/collections/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error('Failed to rename collection');
  return res.json();
}

export function CollectionsList() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });

  const createMutation = useMutation({
    mutationFn: createCollectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setNewName('');
      toast.success('Collection created');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCollectionApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      toast.success('Collection deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameCollectionApi(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      setEditingId(null);
      toast.success('Collection renamed');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    createMutation.mutate({ name: newName.trim() });
  }

  function handleRename(id: string) {
    if (!editName.trim()) return;
    renameMutation.mutate({ id, name: editName.trim() });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
        Failed to load collections. Please try refreshing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create form */}
      <form onSubmit={handleCreate} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New collection name..."
          className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !newName.trim()}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {createMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Create
        </button>
      </form>

      {/* Collections list */}
      {!collections?.length ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <FolderOpen className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No collections yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <div
              key={c.id}
              className="group relative flex flex-col rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
            >
              {editingId === c.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRename(c.id);
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex h-8 flex-1 rounded border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                  />
                  <button
                    type="submit"
                    disabled={renameMutation.isPending}
                    className="rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <Link href={`/dashboard/collections/${c.id}`} className="block">
                  <h3 className="font-medium">{c.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">/{c.slug}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Updated {new Date(c.updatedAt).toLocaleDateString()}
                  </p>
                </Link>
              )}

              {/* Action buttons */}
              <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={() => {
                    setEditingId(c.id);
                    setEditName(c.name);
                  }}
                  className="rounded p-1 hover:bg-accent"
                  title="Rename"
                >
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this collection?')) {
                      deleteMutation.mutate(c.id);
                    }
                  }}
                  className="rounded p-1 hover:bg-destructive/10"
                  title="Delete"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
