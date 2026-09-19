import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/** Toggle for Login link on public ICMS tenant header. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants"
      ADD COLUMN IF NOT EXISTS "show_public_login" boolean DEFAULT true;
  `)
  await db.execute(sql`
    UPDATE "icms_tenants"
    SET "show_public_login" = false
    WHERE "slug" = 'anas-bn-malik';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "show_public_login";
  `)
}
