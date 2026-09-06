import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Per-tenant homepage section order (JSON array of section ids). */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "home_section_order" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "home_section_order";
  `)
}
