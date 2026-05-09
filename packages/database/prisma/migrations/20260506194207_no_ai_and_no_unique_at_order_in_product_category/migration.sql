-- DropIndex
DROP INDEX "product_name_idx";

-- DropIndex
DROP INDEX "product_category_name_idx";

-- DropIndex
DROP INDEX "product_category_order_key";

-- AlterTable
ALTER TABLE "product_category" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "product_category_order_seq";

-- CreateIndex
CREATE INDEX "product_is_active_idx" ON "product"("is_active");

-- CreateIndex
CREATE INDEX "product_category_order_idx" ON "product_category"("order");
