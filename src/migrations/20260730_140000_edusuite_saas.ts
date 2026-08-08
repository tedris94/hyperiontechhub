import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * EduSuite multi-tenant School OS tables.
 * Dev typically uses Payload push (`npm run db:push:edusuite`).
 * This migration creates core tenant tables if missing so production migrate works.
 * Remaining edu-* module tables are created on first non-production Payload boot (push)
 * or by re-running db:push:edusuite once after deploy.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_schools_school_type" AS ENUM('private', 'islamic', 'public');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_schools_status" AS ENUM('active', 'trial', 'suspended');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_school_memberships_school_role" AS ENUM(
        'owner','principal','vice_principal','teacher','accountant','hr','librarian',
        'transport','hostel','admission','parent','student','alumni','it_support'
      );
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_school_memberships_status" AS ENUM('active', 'invited', 'disabled');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "schools" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "slug" varchar NOT NULL,
      "school_type" "enum_schools_school_type" DEFAULT 'private' NOT NULL,
      "city" varchar,
      "state" varchar DEFAULT 'FCT',
      "address" varchar,
      "phone" varchar,
      "email" varchar,
      "status" "enum_schools_status" DEFAULT 'active',
      "current_term" varchar DEFAULT 'First Term',
      "current_session" varchar DEFAULT '2025/2026',
      "primary_color" varchar DEFAULT '#1A2BC2',
      "paystack_subaccount" varchar,
      "settings_notes" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS "schools_slug_idx" ON "schools" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "schools_updated_at_idx" ON "schools" USING btree ("updated_at");
    CREATE INDEX IF NOT EXISTS "schools_created_at_idx" ON "schools" USING btree ("created_at");

    CREATE TABLE IF NOT EXISTS "schools_grading_scale" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "grade" varchar NOT NULL,
      "min_score" numeric NOT NULL,
      "max_score" numeric NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "schools_grading_scale" ADD CONSTRAINT "schools_grading_scale_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."schools"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "school_memberships" (
      "id" serial PRIMARY KEY NOT NULL,
      "user_id" integer NOT NULL,
      "school_id" integer NOT NULL,
      "school_role" "enum_school_memberships_school_role" NOT NULL,
      "status" "enum_school_memberships_status" DEFAULT 'active',
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
    );

    DO $$ BEGIN
      ALTER TABLE "school_memberships" ADD CONSTRAINT "school_memberships_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "school_memberships" ADD CONSTRAINT "school_memberships_school_id_schools_id_fk"
        FOREIGN KEY ("school_id") REFERENCES "public"."schools"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE INDEX IF NOT EXISTS "school_memberships_user_idx" ON "school_memberships" USING btree ("user_id");
    CREATE INDEX IF NOT EXISTS "school_memberships_school_idx" ON "school_memberships" USING btree ("school_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "school_memberships" CASCADE;
    DROP TABLE IF EXISTS "schools_grading_scale" CASCADE;
    DROP TABLE IF EXISTS "schools" CASCADE;
  `)
}
