import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Portfolio case-study fields + services.href for Nigeria income/trust portfolio plan.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "href" varchar;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_portfolio_items_industry" AS ENUM('schools', 'smes', 'other');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "slug" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "industry" "enum_portfolio_items_industry" DEFAULT 'other';
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "category" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "summary" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "challenge" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "solution" varchar;
    ALTER TABLE "portfolio_items" ADD COLUMN IF NOT EXISTS "featured" boolean DEFAULT false;

    CREATE TABLE IF NOT EXISTS "portfolio_items_results" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "item" varchar NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "portfolio_items_results" ADD CONSTRAINT "portfolio_items_results_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."portfolio_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;

    CREATE INDEX IF NOT EXISTS "portfolio_items_results_order_idx" ON "portfolio_items_results" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "portfolio_items_results_parent_id_idx" ON "portfolio_items_results" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "portfolio_items_slug_idx" ON "portfolio_items" USING btree ("slug");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "portfolio_items_results" CASCADE;
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "slug";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "industry";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "category";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "summary";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "challenge";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "solution";
    ALTER TABLE "portfolio_items" DROP COLUMN IF EXISTS "featured";
    ALTER TABLE "services" DROP COLUMN IF EXISTS "href";
    DROP TYPE IF EXISTS "public"."enum_portfolio_items_industry";
  `)
}
