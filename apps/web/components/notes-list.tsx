'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, FileText, Loader2, ArrowLeft, Tag } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Note {
  id: string;
  content: string;
  collectionId: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

async function fetchNotes(collectionId: string): Promise<Note[]> {
  const res = await fetch(`/api/v1/collections/${collectionId}/notes`);
  if (!res.ok) throw new Error('Failed to fetch notes');
  const json = await res.json();
  return json.data;
}

async function createNoteApi(collectionId: string, data: { content: string; tags?: string[] }) {
  const res = await fetch(`/api/v1/collections/${collectionId}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? 'Failed to create note');
  }
  return res.json();
}

async function updateNoteApi(
  collectionId: string,
  noteId: string,
  data: { content?: string; tags?: string[] },
) {
  const res = await fetch(`/api/v1/collections/${collectionId}/notes/${noteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update note');
  return res.json();
}

async function deleteNoteApi(collectionId: string, noteId: string) {
  const res = await fetch(`/api/v1/collections/${collectionId}/notes/${noteId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete note');
  return res.json();
}

export function NotesList({ collectionId, collectionName }: { collectionId: string; collectionName: string }) {
  const queryClient = useQueryClient();
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const { data: notesList, isLoading, error } = useQuery({
    queryKey: ['notes', collectionId],
    queryFn: () => fetchNotes(collectionId),
  });

  const createMutation = useMutation({
    mutationFn: (data: { content: string; tags?: string[] }) =>
      createNoteApi(collectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', collectionId] });
      setNewContent('');
      setNewTags('');
      toast.success('Note created');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ noteId, data }: { noteId: string; data: { content?: string; tags?: string[] } }) =>
      updateNoteApi(collectionId, noteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', collectionId] });
      setEditingId(null);
      toast.success('Note updated');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (noteId: string) => deleteNoteApi(collectionId, noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes', collectionId] });
      toast.success('Note deleted');
    },
    onError: (err: Error) => toast.error(err.message),
  });

  function parseTags(input: string): string[] {
    return input
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newContent.trim()) return;
    const tags = parseTags(newTags);
    createMutation.mutate({ content: newContent.trim(), tags: tags.length ? tags : undefined });
  }

  function handleUpdate(noteId: string) {
    if (!editContent.trim()) return;
    const tags = parseTags(editTags);
    updateMutation.mutate({ noteId, data: { content: editContent.trim(), tags } });
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
        Failed to load notes. Please try refreshing.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with back link */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/collections"
          className="rounded-md p-1.5 hover:bg-accent"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-semibold">{collectionName}</h2>
      </div>

      {/* Create note form */}
      <form onSubmit={handleCreate} className="space-y-3 rounded-lg border bg-card p-4">
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a new note..."
          rows={3}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newTags}
            onChange={(e) => setNewTags(e.target.value)}
            placeholder="Tags (comma-separated)..."
            className="flex h-9 flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button
            type="submit"
            disabled={createMutation.isPending || !newContent.trim()}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Add Note
          </button>
        </div>
      </form>

      {/* Notes list */}
      {!notesList?.length ? (
        <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-12 text-center">
          <FileText className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No notes yet. Create one to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notesList.map((note) => (
            <div
              key={note.id}
              className="group relative rounded-lg border bg-card p-4 transition-shadow hover:shadow-md"
            >
              {editingId === note.id ? (
                <div className="space-y-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    autoFocus
                  />
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="Tags (comma-separated)..."
                    className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      disabled={updateMutation.isPending}
                      className="rounded bg-primary px-3 py-1 text-xs text-primary-foreground"
                    >
                      {updateMutation.isPending ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded border px-3 py-1 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                  {note.tags && note.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </>
              )}

              {/* Action buttons */}
              {editingId !== note.id && (
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => {
                      setEditingId(note.id);
                      setEditContent(note.content);
                      setEditTags(note.tags?.join(', ') ?? '');
                    }}
                    className="rounded p-1 hover:bg-accent"
                    title="Edit"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this note?')) {
                        deleteMutation.mutate(note.id);
                      }
                    }}
                    className="rounded p-1 hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
