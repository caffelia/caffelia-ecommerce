import { Migration } from '@mikro-orm/migrations';

export class Migration20250809182947 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "col_department" ("dept_code" text not null, "name" text not null, "dane_code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "col_department_pkey" primary key ("dept_code"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_col_department_deleted_at" ON "col_department" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "col_municipality" ("muni_code" text not null, "dept_code" text not null, "name" text not null, "type" text null, "longitude" integer null, "latitude" integer null, "dane_code" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "col_municipality_pkey" primary key ("muni_code"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_col_municipality_deleted_at" ON "col_municipality" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "col_department" cascade;`);

    this.addSql(`drop table if exists "col_municipality" cascade;`);
  }

}
