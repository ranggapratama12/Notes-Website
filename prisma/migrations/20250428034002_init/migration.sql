-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "auth";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "form";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "notes";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "notes"."notes" (
    "id_notes" VARCHAR(255) NOT NULL DEFAULT public.uuid_generate_v4(),
    "id_user" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notes_pkey" PRIMARY KEY ("id_notes")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_responsen_cuid" ON "notes"."notes"("id_notes");
