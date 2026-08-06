/*
  Warnings:

  - You are about to drop the column `role` on the `Supplier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetPasswordToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `phone` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PURCHASES" DROP CONSTRAINT "PURCHASES_supplier_id_fkey";

-- DropForeignKey
ALTER TABLE "PURCHASES" DROP CONSTRAINT "PURCHASES_user_id_fkey";

-- DropForeignKey
ALTER TABLE "PURCHASE_ITEMS" DROP CONSTRAINT "PURCHASE_ITEMS_purchase_id_fkey";

-- DropForeignKey
ALTER TABLE "SALE" DROP CONSTRAINT "SALE_user_id_fkey";

-- DropForeignKey
ALTER TABLE "SALE_ITEMS" DROP CONSTRAINT "SALE_ITEMS_sale_id_fkey";

-- AlterTable
ALTER TABLE "Medicine" ADD COLUMN     "embedding" vector,
ALTER COLUMN "requires_prescription" SET DEFAULT false;

-- AlterTable
ALTER TABLE "PURCHASES" ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "supplier_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SALE" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "role",
ADD COLUMN     "phone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_phone_key" ON "Supplier"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "User_resetPasswordToken_key" ON "User"("resetPasswordToken");

-- AddForeignKey
ALTER TABLE "PURCHASES" ADD CONSTRAINT "PURCHASES_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASES" ADD CONSTRAINT "PURCHASES_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASE_ITEMS" ADD CONSTRAINT "PURCHASE_ITEMS_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "PURCHASES"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE" ADD CONSTRAINT "SALE_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE_ITEMS" ADD CONSTRAINT "SALE_ITEMS_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "SALE"("id") ON DELETE CASCADE ON UPDATE CASCADE;
