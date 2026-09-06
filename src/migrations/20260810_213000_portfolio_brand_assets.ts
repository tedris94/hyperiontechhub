import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Portfolio logo/preview paths + brandColors array table (logo garden / case study UI).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."enum_portfolio_items_industry" ADD VALUE IF NOT EXISTS 'mosques';
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "logo_id" integer;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "logo_path" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "preview_image_path" varchar;

    DO $$ BEGIN
      ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_logo_id_media_id_fk"
        FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "portfolio_items_logo_idx" ON "portfolio_items" USING btree ("logo_id");

    CREATE TABLE IF NOT EXISTS "portfolio_items_brand_colors" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "color" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "portfolio_items_brand_colors" ADD CONSTRAINT "portfolio_items_brand_colors_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "portfolio_items_brand_colors_order_idx"
      ON "portfolio_items_brand_colors" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "portfolio_items_brand_colors_parent_id_idx"
      ON "portfolio_items_brand_colors" USING btree ("_parent_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "portfolio_items_brand_colors" CASCADE;
    ALTER TABLE "portfolio_items" DROP CONSTRAINT IF EXISTS "portfolio_items_logo_id_media_id_fk";
    DROP INDEX IF EXISTS "portfolio_items_logo_idx";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "logo_id";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "logo_path";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "preview_image_path";
  `)
  // Postgres cannot easily remove enum values; leave 'mosques' in place on down.
}
