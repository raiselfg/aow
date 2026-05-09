-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('new', 'in_progress', 'confirmed', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "event_type" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_request" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "event_type_id" UUID NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "budget" INTEGER NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'new',
    "address" TEXT NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "event_type_name_key" ON "event_type"("name");

-- AddForeignKey
ALTER TABLE "event_request" ADD CONSTRAINT "event_request_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "event_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
