import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Public per-tenant navigation items and their ordering. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "navigation" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "navigation";
  `)
}