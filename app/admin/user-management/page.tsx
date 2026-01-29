'use client';

import { useEffect, useMemo, useState } from 'react';
import RequireRole from '@/components/RequireRole';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type UserRole = 'super_admin' | 'admin' | 'subscriber' | 'student' | 'consultant' | 'instructor' | 'client';

interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

const ROLE_OPTIONS: Array<{ value: UserRole; label: string }> = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'student', label: 'Student' },
  { value: 'client', label: 'Client' },
  { value: 'subscriber', label: 'Subscriber' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    password: '',
  });
  const [creating, setCreating] = useState(false);

  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: 'student' as UserRole,
    password: '',
  });
  const [saving, setSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load users.');
      }
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user.');
      }
      setCreateForm({ name: '', email: '', role: 'student', password: '' });
      setUsers((prev) => [data.user, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setCreating(false);
    }
  };

  const openEdit = (user: AppUser) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '',
    });
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user.');
      }
      setUsers((prev) => prev.map((user) => (user.id === data.user.id ? data.user : user)));
      setSelectedUser(null);
      setEditForm({ name: '', email: '', role: 'student', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm('Delete this user? This action cannot be undone.');
    if (!confirmed) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user.');
      }
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      if (selectedUser?.id === userId) {
        setSelectedUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <RequireRole allowedRoles={['admin', 'super_admin']} message="Access denied. Admin roles only.">
      <DashboardLayout title="User Management">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#1B1C1E]">User Management</h1>
              <p className="text-gray-600">Create, update, and remove user accounts.</p>
            </div>
            <div className="w-full lg:w-72">
              <Input
                placeholder="Search users..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading users...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-sm text-gray-500">No users found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                        <tr>
                          <th className="py-2 pr-4">Name</th>
                          <th className="py-2 pr-4">Email</th>
                          <th className="py-2 pr-4">Role</th>
                          <th className="py-2 pr-4">Joined</th>
                          <th className="py-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100">
                            <td className="py-3 pr-4 font-medium text-gray-900">{user.name}</td>
                            <td className="py-3 pr-4 text-gray-600">{user.email}</td>
                            <td className="py-3 pr-4">
                              <Badge variant="outline" className="capitalize">
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4 text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-right space-x-2">
                              <Button size="sm" variant="outline" onClick={() => openEdit(user)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(user.id)}
                                disabled={saving}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create User</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4" onSubmit={handleCreate}>
                    <div className="space-y-2">
                      <Label htmlFor="create-name">Name</Label>
                      <Input
                        id="create-name"
                        value={createForm.name}
                        onChange={(event) =>
                          setCreateForm((prev) => ({ ...prev, name: event.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createForm.email}
                        onChange={(event) =>
                          setCreateForm((prev) => ({ ...prev, email: event.target.value }))
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select
                        value={createForm.role}
                        onValueChange={(value: UserRole) =>
                          setCreateForm((prev) => ({ ...prev, role: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              {role.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-password">Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createForm.password}
                        onChange={(event) =>
                          setCreateForm((prev) => ({ ...prev, password: event.target.value }))
                        }
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={creating}>
                      {creating ? 'Creating...' : 'Create User'}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Edit User</CardTitle>
                </CardHeader>
                <CardContent>
                  {!selectedUser ? (
                    <p className="text-sm text-gray-500">Select a user to edit.</p>
                  ) : (
                    <form className="space-y-4" onSubmit={handleUpdate}>
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Name</Label>
                        <Input
                          id="edit-name"
                          value={editForm.name}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, name: event.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                          id="edit-email"
                          type="email"
                          value={editForm.email}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, email: event.target.value }))
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role</Label>
                        <Select
                          value={editForm.role}
                          onValueChange={(value: UserRole) =>
                            setEditForm((prev) => ({ ...prev, role: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROLE_OPTIONS.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                {role.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-password">Reset Password (optional)</Label>
                        <Input
                          id="edit-password"
                          type="password"
                          value={editForm.password}
                          onChange={(event) =>
                            setEditForm((prev) => ({ ...prev, password: event.target.value }))
                          }
                          placeholder="Leave blank to keep current password"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button type="submit" disabled={saving} className="flex-1">
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setSelectedUser(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RequireRole>
  );
}
