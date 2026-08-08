import type { CollectionConfig } from 'payload'
import { ICMS_ROLES, icmsAdminAccess } from './shared'

export const IcmsTenants: CollectionConfig = {
  slug: 'icms-tenants',
  labels: { singular: 'ICMS Tenant', plural: 'ICMS Tenants' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'status', 'planTier', 'updatedAt'],
    group: 'ICMS',
  },
  access: {
    read: icmsAdminAccess,
    create: icmsAdminAccess,
    update: icmsAdminAccess,
    delete: ({ req }) => (req.user as { role?: string } | null)?.role === 'super_admin',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'URL slug e.g. anas-bn-malik' },
    },
    { name: 'shortName', type: 'text', required: true },
    { name: 'motto', type: 'text' },
    { name: 'address', type: 'textarea' },
    {
      name: 'phones',
      type: 'array',
      fields: [{ name: 'number', type: 'text', required: true }],
    },
    { name: 'email', type: 'email' },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Legacy Payload media logo' },
    },
    {
      name: 'logoUrl',
      type: 'text',
      admin: {
        description: 'Public logo path (set via tenant admin file upload)',
      },
    },
    {
      name: 'colors',
      type: 'group',
      label: 'Brand tokens',
      admin: {
        description:
          'Emerald / Forest / Gold / Ivory / Charcoal / Warm gray. Ratio ~60% ivory, 25% emerald/forest, 10% gold, 5% gray. Edit in tenant admin → Brand tokens.',
      },
      fields: [
        {
          name: 'emerald',
          type: 'text',
          defaultValue: '#0F5A43',
          admin: { description: 'Primary (#0F5A43)' },
        },
        {
          name: 'forest',
          type: 'text',
          defaultValue: '#07382B',
          admin: { description: 'Dark sections, footer (#07382B)' },
        },
        {
          name: 'gold',
          type: 'text',
          defaultValue: '#C79A2C',
          admin: { description: 'Accents, rules (#C79A2C)' },
        },
        {
          name: 'ivory',
          type: 'text',
          defaultValue: '#FAF8F2',
          admin: { description: 'Page background (#FAF8F2)' },
        },
        {
          name: 'charcoal',
          type: 'text',
          defaultValue: '#1E1E1E',
          admin: { description: 'Body text (#1E1E1E)' },
        },
        {
          name: 'warmGray',
          type: 'text',
          defaultValue: '#6F6F6F',
          admin: { description: 'Muted (#6F6F6F)' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'trial',
      options: [
        { label: 'Trial', value: 'trial' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'planTier',
      type: 'select',
      defaultValue: 'community',
      admin: { description: 'Sizing flag only — billing not enabled in this phase' },
      options: [
        { label: 'Community', value: 'community' },
        { label: 'Standard', value: 'standard' },
        { label: 'Professional', value: 'professional' },
      ],
    },
    {
      name: 'uiVariant',
      type: 'select',
      defaultValue: 'classic',
      options: [
        { label: 'Classic', value: 'classic' },
        { label: 'Modern', value: 'modern' },
        { label: 'Community', value: 'community' },
        { label: 'Scholarly', value: 'scholarly' },
        { label: 'Compact', value: 'compact' },
      ],
      admin: {
        description:
          'Public site layout pack (nav/hero/section order). Brand colors still apply on top.',
      },
    },
    {
      name: 'domainLabel',
      type: 'text',
      admin: {
        description:
          'Primary public host display (usually {slug}.hyperiontechhub.com). Updated when custom domain activates.',
      },
    },
    {
      name: 'customDomain',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Normalized custom hostname e.g. www.masjid.org (optional)',
      },
    },
    {
      name: 'customDomainStatus',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Pending DNS', value: 'pending_dns' },
        { label: 'Pending SSL', value: 'pending_ssl' },
        { label: 'Active', value: 'active' },
        { label: 'Error', value: 'error' },
      ],
    },
    {
      name: 'customDomainError',
      type: 'text',
      admin: { description: 'Last custom-domain provisioning error' },
    },
    {
      name: 'roleCapabilityOverrides',
      type: 'array',
      labels: { singular: 'Role grant', plural: 'Role capability grants' },
      admin: {
        description:
          'Optional per-tenant capability grants. When a role has an override row, it replaces the default preset. Managed in Team → Visibility grants (super_admin).',
      },
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: ICMS_ROLES.map((r) => ({ label: r, value: r })),
        },
        {
          name: 'capabilities',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Articles & events', value: 'content' },
            { label: 'Site pages', value: 'pages' },
            { label: 'Leadership', value: 'leadership' },
            { label: 'Shurah & committees', value: 'committee' },
            { label: 'Waqf', value: 'waqf' },
            { label: 'Facilities', value: 'facilities' },
            { label: 'Donate funds', value: 'donate_funds' },
            { label: 'Donations', value: 'finance' },
            { label: 'Centre settings', value: 'settings' },
            { label: 'Custom domains', value: 'domains' },
            { label: 'Team & users', value: 'members' },
            { label: 'Inbox', value: 'inbox' },
            { label: 'Prayer', value: 'prayer' },
            { label: 'Bank', value: 'bank' },
          ],
        },
      ],
    },
    {
      name: 'prayer',
      type: 'group',
      label: 'Prayer times location',
      admin: {
        description:
          'Set coordinates and calculation method only — daily and weekly times are computed live (Adhan / Al-Moazin-style). Do not enter times manually.',
      },
      fields: [
        {
          name: 'latitude',
          type: 'number',
          required: true,
          defaultValue: 9.0145,
          admin: { step: 0.0001 },
        },
        {
          name: 'longitude',
          type: 'number',
          required: true,
          defaultValue: 7.3986,
          admin: { step: 0.0001 },
        },
        {
          name: 'timezone',
          type: 'text',
          required: true,
          defaultValue: 'Africa/Lagos',
          admin: { description: 'IANA timezone, e.g. Africa/Lagos' },
        },
        {
          name: 'locationLabel',
          type: 'text',
          defaultValue: 'Abuja, FCT',
          admin: { description: 'Shown on public prayer strips' },
        },
        {
          name: 'calculationMethod',
          type: 'select',
          defaultValue: 'MuslimWorldLeague',
          options: [
            { label: 'Muslim World League', value: 'MuslimWorldLeague' },
            { label: 'Egyptian General Authority', value: 'Egyptian' },
            { label: 'University of Islamic Sciences, Karachi', value: 'Karachi' },
            { label: 'Umm al-Qura, Makkah', value: 'UmmAlQura' },
            { label: 'ISNA (North America)', value: 'NorthAmerica' },
            { label: 'Dubai', value: 'Dubai' },
            { label: 'Kuwait', value: 'Kuwait' },
            { label: 'Qatar', value: 'Qatar' },
            { label: 'Singapore', value: 'Singapore' },
            { label: 'Moonsighting Committee', value: 'MoonsightingCommittee' },
            { label: 'Tehran', value: 'Tehran' },
            { label: 'Turkey', value: 'Turkey' },
          ],
        },
        {
          name: 'madhab',
          type: 'select',
          defaultValue: 'Shafi',
          options: [
            { label: 'Shafi (standard Asr)', value: 'Shafi' },
            { label: 'Hanafi (later Asr)', value: 'Hanafi' },
          ],
        },
      ],
    },
    {
      name: 'bank',
      type: 'group',
      label: 'Donation bank account',
      admin: {
        description: 'Shown for manual bank transfers on the public donate page.',
      },
      fields: [
        { name: 'bankName', type: 'text', admin: { description: 'e.g. Guaranty Trust Bank' } },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        {
          name: 'transferNote',
          type: 'textarea',
          admin: {
            description: 'Optional instruction shown under the account details (narration tip).',
          },
        },
      ],
    },
    {
      name: 'paystack',
      type: 'group',
      label: 'Paystack (this tenant)',
      admin: {
        description:
          'Each ICMS tenant uses its own Paystack keys. Do not rely on platform .env keys for donations.',
      },
      fields: [
        {
          name: 'secretKey',
          type: 'text',
          admin: {
            description: 'Live or test secret key (sk_…). Never share publicly.',
          },
        },
        {
          name: 'publicKey',
          type: 'text',
          admin: {
            description: 'Matching public key (pk_…). Optional if using redirect checkout only.',
          },
        },
      ],
    },
  ],
}

export const IcmsMemberships: CollectionConfig = {
  slug: 'icms-memberships',
  labels: { singular: 'ICMS Membership', plural: 'ICMS Memberships' },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'tenant', 'role', 'status'],
    group: 'ICMS',
  },
  access: {
    read: icmsAdminAccess,
    create: icmsAdminAccess,
    update: icmsAdminAccess,
    delete: icmsAdminAccess,
  },
  fields: [
    { name: 'user', type: 'relationship', relationTo: 'users', required: true, index: true },
    { name: 'tenant', type: 'relationship', relationTo: 'icms-tenants', required: true, index: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: ICMS_ROLES.map((r) => ({
        label: `ICMS · ${r.replace(/_/g, ' ')}`,
        value: r,
      })),
      // Only hide `owner` from non-platform actors in Payload admin UI.
      // Returning [] previously blocked centre owners from assigning any role via API.
      filterOptions: ({ options, req }) => {
        const actor = (req.user as { role?: string } | null)?.role
        if (actor === 'super_admin' || actor === 'admin') return options
        return options.filter((o) => {
          const value = typeof o === 'string' ? o : (o as { value?: string }).value
          return value !== 'owner'
        })
      },
      admin: {
        description: 'Tenant-scoped ICMS role (not a Hyperion dashboard role).',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Invited', value: 'invited' },
        { label: 'Disabled', value: 'disabled' },
      ],
    },
  ],
}
