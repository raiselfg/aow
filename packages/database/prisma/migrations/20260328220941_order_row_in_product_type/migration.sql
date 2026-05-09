/*
  Warnings:

  - A unique constraint covering the columns `[order]` on the table `product_type` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "product_type" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "product_type_order_key" ON "product_type"("order");
