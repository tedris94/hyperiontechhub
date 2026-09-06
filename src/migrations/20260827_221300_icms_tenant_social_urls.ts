import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/** Extra public social URLs for ICMS tenant footers. */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "facebook_url" varchar;
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "instagram_url" varchar;
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "youtube_url" varchar;
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "twitter_url" varchar;
    ALTER TABLE "icms_tenants" ADD COLUMN IF NOT EXISTS "whatsapp_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "facebook_url";
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "instagram_url";
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "youtube_url";
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "twitter_url";
    ALTER TABLE "icms_tenants" DROP COLUMN IF EXISTS "whatsapp_url";
  `)
}
