import type { CollectionConfig, FieldAccess, Option } from 'payload'
import { recordAuthEvent } from '@/lib/audit'
import {
  canAssignPlatformRole,
  filterPlatformRoleOptions,
  platformRoleOptions,
} from '@/lib/roleCatalog'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    tokenExpiration: 7200,
    cookies: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullName', 'role'],
    description:
      'Hyperion platform role only. Assign ICMS roles on ICMS Memberships and EduSuite roles on School Memberships.',
  },
  hooks: {
    afterLogin: [
      async ({ req, user }) => {
        await recordAuthEvent(req, 'login', user as { id?: unknown; email?: string; role?: string })
      },
    ],
    afterLogout: [
      async ({ req }) => {
        await recordAuthEvent(
          req,
          'logout',
          req.user as { id?: unknown; email?: string; role?: string } | null,
        )
      },
    ],
    beforeValidate: [
      ({ data, req, operation }) => {
        if (!data?.role) return data
        const actor = (req.user as { role?: string } | null)?.role
        if (operation === 'create' || operation === 'update') {
          if (!canAssignPlatformRole(actor, String(data.role)) && actor) {
            throw new Error('You cannot assign this Hyperion platform role.')
          }
        }
        return data
      },
    ],
  },
  fields: [
    { name: 'fullName', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenant_member',
      options: platformRoleOptions() as Option[],
      filterOptions: ({ options, req }) => {
        const actor = (req.user as { role?: string } | null)?.role
        return filterPlatformRoleOptions(actor, options as { label: string; value: string }[])
      },
      admin: {
        description:
          'Hyperion platform access. Use “Tenant member” for mosque/center staff who should only use ICMS (no Hyperion dashboard). Then assign ICMS Memberships (owner, director, imam, content_editor, waqf_manager, secretary, finance, viewer). EduSuite roles belong on School Memberships.',
      },
      access: {
        // Super admin and admin can set platform roles (filtered by filterOptions)
        update: (({ req }) => {
          const role = (req.user as { role?: string } | undefined)?.role
          return role === 'super_admin' || role === 'admin'
        }) as FieldAccess,
      },
      validate: (value, { req }) => {
        const actor = (req.user as { role?: string } | null)?.role
        if (!value) return 'Role is required'
        if (actor && !canAssignPlatformRole(actor, String(value))) {
          return 'You cannot assign this role'
        }
        return true
      },
    },
  ],
}
