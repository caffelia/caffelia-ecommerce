import { Migration } from '@mikro-orm/migrations';

export class Migration20250818210401 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "chat_session" ("wa_id" text not null, "cart_id" text null, "current_state" text null, "state_data" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "chat_session_pkey" primary key ("wa_id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_chat_session_deleted_at" ON "chat_session" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "chat_session" cascade;`);
  }

}
