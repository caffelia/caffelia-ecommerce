import { Migration } from '@mikro-orm/migrations';

export class Migration20250807171554 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "active_cart" ("user_id" text not null, "cart_id" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "active_cart_pkey" primary key ("user_id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_active_cart_deleted_at" ON "active_cart" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "active_cart" cascade;`);
  }

}
