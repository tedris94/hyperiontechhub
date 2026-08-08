import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Site setting: show/hide Demo Accounts on the public login page.
 * Also registers settings.manage on the dashboard-roles capability enum.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings"
      ADD COLUMN IF NOT EXISTS "show_demo_accounts" boolean DEFAULT true;
  `)

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_dashboard_roles_capabilities_key" ADD VALUE IF NOT EXISTS 'settings.manage';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "show_demo_accounts";
  `)
  // Postgres cannot easily remove enum values; leave settings.manage in place on down.
}
