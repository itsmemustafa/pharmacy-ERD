-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "address" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "generic_name" TEXT NOT NULL,
    "price_sell" DECIMAL(10,2) NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "requires_prescription" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MEDICINE_BATCHES" (
    "id" SERIAL NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "batch_number" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price_buy" DECIMAL(10,2) NOT NULL,
    "expiry_Date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MEDICINE_BATCHES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PURCHASES" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "supplier_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "purchase_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PURCHASES_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PURCHASE_ITEMS" (
    "id" SERIAL NOT NULL,
    "purchase_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "PURCHASE_ITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SALE" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "payment_method" TEXT NOT NULL DEFAULT 'cash',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SALE_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SALE_ITEMS" (
    "id" SERIAL NOT NULL,
    "sale_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "batch_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "SALE_ITEMS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_email_key" ON "Supplier"("email");

-- AddForeignKey
ALTER TABLE "MEDICINE_BATCHES" ADD CONSTRAINT "MEDICINE_BATCHES_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MEDICINE_BATCHES" ADD CONSTRAINT "MEDICINE_BATCHES_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASES" ADD CONSTRAINT "PURCHASES_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASES" ADD CONSTRAINT "PURCHASES_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASE_ITEMS" ADD CONSTRAINT "PURCHASE_ITEMS_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "PURCHASES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASE_ITEMS" ADD CONSTRAINT "PURCHASE_ITEMS_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PURCHASE_ITEMS" ADD CONSTRAINT "PURCHASE_ITEMS_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "MEDICINE_BATCHES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE" ADD CONSTRAINT "SALE_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE_ITEMS" ADD CONSTRAINT "SALE_ITEMS_sale_id_fkey" FOREIGN KEY ("sale_id") REFERENCES "SALE"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE_ITEMS" ADD CONSTRAINT "SALE_ITEMS_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SALE_ITEMS" ADD CONSTRAINT "SALE_ITEMS_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "MEDICINE_BATCHES"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
