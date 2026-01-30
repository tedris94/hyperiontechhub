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

interface ActivityLog {
  id: string;
  action: string;
  target_user_id?: string | null;
  target_email?: string | null;
  details?: string | null;
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
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkRole, setBulkRole] = useState<UserRole>('student');
  const [bulkLoading, setBulkLoading] = useState(false);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [activityError, setActivityError] = useState('');
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

  const loadActivity = async () => {
    setLoadingLogs(true);
    setActivityError('');
    try {
      const response = await fetch('/api/admin/activity');
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load activity.');
      }
      setActivityLogs(data.logs || []);
    } catch (err) {
      setActivityError(err instanceof Error ? err.message : 'Failed to load activity.');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    void loadUsers();
    void loadActivity();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    const roleFiltered = roleFilter === 'all' ? users : users.filter((user) => user.role === roleFilter);
    if (!query) return roleFiltered;
    return roleFiltered.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [users, search, roleFilter]);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allVisibleSelected =
    filteredUsers.length > 0 && filteredUsers.every((user) => selectedSet.has(user.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const remaining = selectedIds.filter((id) => !filteredUsers.some((user) => user.id === id));
      setSelectedIds(remaining);
      return;
    }
    const merged = new Set(selectedIds);
    filteredUsers.forEach((user) => merged.add(user.id));
    setSelectedIds(Array.from(merged));
  };

  const toggleSelectUser = (userId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      }
      return [...prev, userId];
    });
  };

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
      void loadActivity();
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
      void loadActivity();
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
      setSelectedIds((prev) => prev.filter((id) => id !== userId));
      void loadActivity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user.');
    } finally {
      setSaving(false);
    }
  };

  const handleBulkRoleUpdate = async () => {
    if (selectedIds.length === 0) return;
    setBulkLoading(true);
    setError('');
    try {
      const selectedUsers = users.filter((user) => selectedSet.has(user.id));
      const updates = await Promise.all(
        selectedUsers.map(async (user) => {
          const response = await fetch(`/api/admin/users/${user.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              role: bulkRole,
              password: '',
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || `Failed to update ${user.email}`);
          }
          return data.user as AppUser;
        })
      );
      setUsers((prev) =>
        prev.map((user) => updates.find((updated) => updated.id === user.id) || user)
      );
      setSelectedIds([]);
      void loadActivity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update selected users.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm('Delete selected users? This action cannot be undone.');
    if (!confirmed) return;
    setBulkLoading(true);
    setError('');
    try {
      const deletions = await Promise.all(
        selectedIds.map(async (userId) => {
          const response = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to delete selected users.');
          }
          return userId;
        })
      );
      setUsers((prev) => prev.filter((user) => !deletions.includes(user.id)));
      setSelectedIds([]);
      if (selectedUser && deletions.includes(selectedUser.id)) {
        setSelectedUser(null);
      }
      void loadActivity();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete selected users.');
    } finally {
      setBulkLoading(false);
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
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              <div className="w-full lg:w-72">
                <Input
                  placeholder="Search users..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="w-full lg:w-56">
                <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All roles</SelectItem>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {selectedIds.length > 0 && (
            <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm lg:flex-row lg:items-center lg:justify-between">
              <span className="font-medium text-slate-700">{selectedIds.length} selected</span>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={bulkRole} onValueChange={(value) => setBulkRole(value as UserRole)}>
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Set role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleBulkRoleUpdate} disabled={bulkLoading}>
                  {bulkLoading ? 'Updating...' : 'Apply Role'}
                </Button>
                <Button variant="destructive" onClick={handleBulkDelete} disabled={bulkLoading}>
                  {bulkLoading ? 'Deleting...' : 'Delete Selected'}
                </Button>
              </div>
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
                          <th className="py-2 pr-4">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-[#1A2BC2]"
                              checked={allVisibleSelected}
                              onChange={toggleSelectAll}
                              aria-label="Select all users"
                            />
                          </th>
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
                            <td className="py-3 pr-4">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-[#1A2BC2]"
                                checked={selectedSet.has(user.id)}
                                onChange={() => toggleSelectUser(user.id)}
                                aria-label={`Select ${user.name}`}
                              />
                            </td>
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
                        onValueChange={(value) =>
                          setCreateForm((prev) => ({ ...prev, role: value as UserRole }))
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
                          onValueChange={(value) =>
                            setEditForm((prev) => ({ ...prev, role: value as UserRole }))
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

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {activityError && (
                    <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                      {activityError}
                    </div>
                  )}
                  {loadingLogs ? (
                    <div className="text-sm text-gray-500">Loading activity...</div>
                  ) : activityLogs.length === 0 ? (
                    <div className="text-sm text-gray-500">No activity yet.</div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      {activityLogs.map((log) => (
                        <div key={log.id} className="border-b border-gray-100 pb-3 last:border-none">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {log.action}
                            </Badge>
                            <span className="font-medium text-gray-900">
                              {log.target_email || 'User account'}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {log.details || 'No additional details'} •{' '}
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
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
