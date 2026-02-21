import prisma from './src/lib/prisma.js';
import bcrypt from 'bcryptjs';


async function main() {
  console.log('Starting seed...');

  // Clear existing data
  await prisma.sALE_ITEMS.deleteMany();
  await prisma.sALE.deleteMany();
  await prisma.pURCHASE_ITEMS.deleteMany();
  await prisma.pURCHASES.deleteMany();
  await prisma.mEDICINE_BATCHES.deleteMany();
  await prisma.medicine.deleteMany();
  await prisma.token.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

  // Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Anderson',
        email: 'john.anderson@pharmacy.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@pharmacy.com',
        password: hashedPassword,
        role: 'pharmacist',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Michael Chen',
        email: 'michael.chen@pharmacy.com',
        password: hashedPassword,
        role: 'pharmacist',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@pharmacy.com',
        password: hashedPassword,
        role: 'cashier',
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: 'David Thompson',
        email: 'david.thompson@pharmacy.com',
        password: hashedPassword,
        role: 'user',
        isVerified: false,
        verificationToken: 'verify_token_12345',
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);

  // Create Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({
      data: {
        name: 'PharmaCorp International',
        phone: '+1-555-0101',
        email: 'orders@pharmacorp.com',
        address: '1250 Medical Plaza Drive, Boston, MA 02115',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'MedSupply Solutions',
        phone: '+1-555-0202',
        email: 'sales@medsupply.com',
        address: '890 Healthcare Boulevard, Chicago, IL 60611',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Global Healthcare Distributors',
        phone: '+1-555-0303',
        email: 'contact@globalhealthcare.com',
        address: '3456 Wellness Street, New York, NY 10001',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'Premier Pharmaceuticals Ltd',
        phone: '+1-555-0404',
        email: 'info@premierpharm.com',
        address: '777 Medicine Way, San Francisco, CA 94102',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'HealthFirst Medical Supplies',
        phone: '+1-555-0505',
        email: 'orders@healthfirst.com',
        address: '2100 Care Center Road, Miami, FL 33101',
      },
    }),
    prisma.supplier.create({
      data: {
        name: 'BioMed Distribution Inc',
        phone: '+1-555-0606',
        email: 'sales@biomed-dist.com',
        address: '5500 Pharmaceutical Parkway, Seattle, WA 98101',
      },
    }),
  ]);

  console.log(`Created ${suppliers.length} suppliers`);

  // Create Medicines
  const medicines = await Promise.all([
    // Antibiotics
    prisma.medicine.create({
      data: {
        name: 'Amoxicillin 500mg',
        generic_name: 'Amoxicillin',
        price_sell: 12.99,
        min_quantity: 50,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Azithromycin 250mg',
        generic_name: 'Azithromycin',
        price_sell: 18.50,
        min_quantity: 30,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Ciprofloxacin 500mg',
        generic_name: 'Ciprofloxacin',
        price_sell: 22.75,
        min_quantity: 40,
        requires_prescription: true,
      },
    }),
    // Pain Relief
    prisma.medicine.create({
      data: {
        name: 'Ibuprofen 400mg',
        generic_name: 'Ibuprofen',
        price_sell: 8.99,
        min_quantity: 100,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Acetaminophen 500mg',
        generic_name: 'Paracetamol',
        price_sell: 7.49,
        min_quantity: 150,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Naproxen 250mg',
        generic_name: 'Naproxen',
        price_sell: 11.25,
        min_quantity: 60,
        requires_prescription: false,
      },
    }),
    // Cardiovascular
    prisma.medicine.create({
      data: {
        name: 'Lisinopril 10mg',
        generic_name: 'Lisinopril',
        price_sell: 15.99,
        min_quantity: 80,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Atorvastatin 20mg',
        generic_name: 'Atorvastatin',
        price_sell: 24.99,
        min_quantity: 70,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Metoprolol 50mg',
        generic_name: 'Metoprolol',
        price_sell: 19.50,
        min_quantity: 60,
        requires_prescription: true,
      },
    }),
    // Diabetes
    prisma.medicine.create({
      data: {
        name: 'Metformin 500mg',
        generic_name: 'Metformin',
        price_sell: 13.75,
        min_quantity: 100,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Glipizide 5mg',
        generic_name: 'Glipizide',
        price_sell: 16.99,
        min_quantity: 50,
        requires_prescription: true,
      },
    }),
    // Allergy & Cold
    prisma.medicine.create({
      data: {
        name: 'Cetirizine 10mg',
        generic_name: 'Cetirizine',
        price_sell: 9.99,
        min_quantity: 80,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Loratadine 10mg',
        generic_name: 'Loratadine',
        price_sell: 8.75,
        min_quantity: 90,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Pseudoephedrine 30mg',
        generic_name: 'Pseudoephedrine',
        price_sell: 10.50,
        min_quantity: 60,
        requires_prescription: false,
      },
    }),
    // Gastrointestinal
    prisma.medicine.create({
      data: {
        name: 'Omeprazole 20mg',
        generic_name: 'Omeprazole',
        price_sell: 14.99,
        min_quantity: 70,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Ranitidine 150mg',
        generic_name: 'Ranitidine',
        price_sell: 11.99,
        min_quantity: 60,
        requires_prescription: false,
      },
    }),
    // Respiratory
    prisma.medicine.create({
      data: {
        name: 'Albuterol Inhaler',
        generic_name: 'Albuterol',
        price_sell: 32.99,
        min_quantity: 30,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Montelukast 10mg',
        generic_name: 'Montelukast',
        price_sell: 21.50,
        min_quantity: 50,
        requires_prescription: true,
      },
    }),
    // Mental Health
    prisma.medicine.create({
      data: {
        name: 'Sertraline 50mg',
        generic_name: 'Sertraline',
        price_sell: 18.99,
        min_quantity: 60,
        requires_prescription: true,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Escitalopram 10mg',
        generic_name: 'Escitalopram',
        price_sell: 20.75,
        min_quantity: 50,
        requires_prescription: true,
      },
    }),
    // Vitamins & Supplements
    prisma.medicine.create({
      data: {
        name: 'Vitamin D3 2000 IU',
        generic_name: 'Cholecalciferol',
        price_sell: 12.99,
        min_quantity: 100,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Multivitamin Complex',
        generic_name: 'Multivitamin',
        price_sell: 15.99,
        min_quantity: 80,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Omega-3 Fish Oil 1000mg',
        generic_name: 'Omega-3 Fatty Acids',
        price_sell: 18.99,
        min_quantity: 70,
        requires_prescription: false,
      },
    }),
    // Antihistamines
    prisma.medicine.create({
      data: {
        name: 'Diphenhydramine 25mg',
        generic_name: 'Diphenhydramine',
        price_sell: 7.99,
        min_quantity: 100,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Fexofenadine 180mg',
        generic_name: 'Fexofenadine',
        price_sell: 13.50,
        min_quantity: 60,
        requires_prescription: false,
      },
    }),
    // Topical
    prisma.medicine.create({
      data: {
        name: 'Hydrocortisone Cream 1%',
        generic_name: 'Hydrocortisone',
        price_sell: 9.99,
        min_quantity: 50,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Mupirocin Ointment 2%',
        generic_name: 'Mupirocin',
        price_sell: 16.75,
        min_quantity: 40,
        requires_prescription: true,
      },
    }),
    // Thyroid
    prisma.medicine.create({
      data: {
        name: 'Levothyroxine 100mcg',
        generic_name: 'Levothyroxine',
        price_sell: 14.50,
        min_quantity: 80,
        requires_prescription: true,
      },
    }),
    // Eye Care
    prisma.medicine.create({
      data: {
        name: 'Artificial Tears Eye Drops',
        generic_name: 'Carboxymethylcellulose',
        price_sell: 11.99,
        min_quantity: 60,
        requires_prescription: false,
      },
    }),
    // Cough & Cold
    prisma.medicine.create({
      data: {
        name: 'Dextromethorphan Syrup',
        generic_name: 'Dextromethorphan',
        price_sell: 9.49,
        min_quantity: 70,
        requires_prescription: false,
      },
    }),
    prisma.medicine.create({
      data: {
        name: 'Guaifenesin 400mg',
        generic_name: 'Guaifenesin',
        price_sell: 8.25,
        min_quantity: 80,
        requires_prescription: false,
      },
    }),
  ]);

  console.log(`Created ${medicines.length} medicines`);

  // Create Medicine Batches
  const batches = [];
  const batchCount = 90;

  for (let i = 0; i < batchCount; i++) {
    const medicine = medicines[Math.floor(Math.random() * medicines.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const monthsToExpiry = Math.floor(Math.random() * 24) + 6; // 6-30 months
    const priceBuy = parseFloat(medicine.price_sell) * (0.4 + Math.random() * 0.3); // 40-70% of sell price
    
    batches.push(
      await prisma.mEDICINE_BATCHES.create({
        data: {
          medicine_id: medicine.id,
          supplier_id: supplier.id,
          batch_number: `BATCH${String(i + 1).padStart(6, '0')}`,
          quantity: Math.floor(Math.random() * 500) + 100,
          price_buy: priceBuy.toFixed(2),
          expiry_Date: new Date(Date.now() + monthsToExpiry * 30 * 24 * 60 * 60 * 1000),
          created_at: new Date(Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000), // Last 6 months
        },
      })
    );
  }

  console.log(`Created ${batches.length} medicine batches`);

  // Create Expired Medicine Batches
  const expiredBatches = [];
  const expiredBatchCount = 15; // Create 15 expired batches

  for (let i = 0; i < expiredBatchCount; i++) {
    const medicine = medicines[Math.floor(Math.random() * medicines.length)];
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    
    // Create batches expired at different times:
    // - Recently expired (1-30 days ago)
    // - Moderately expired (1-6 months ago)
    // - Long expired (6-12 months ago)
    const expiredDaysAgo = i < 5 
      ? Math.floor(Math.random() * 30) + 1  // Recently expired (1-30 days)
      : i < 10
      ? Math.floor(Math.random() * 150) + 30  // Moderately expired (1-5 months)
      : Math.floor(Math.random() * 180) + 180; // Long expired (6-12 months)
    
    const priceBuy = parseFloat(medicine.price_sell) * (0.4 + Math.random() * 0.3);
    
    expiredBatches.push(
      await prisma.mEDICINE_BATCHES.create({
        data: {
          medicine_id: medicine.id,
          supplier_id: supplier.id,
          batch_number: `EXP${String(i + 1).padStart(6, '0')}`, // EXP prefix for expired batches
          quantity: Math.floor(Math.random() * 200) + 20, // Smaller quantities for expired batches
          price_buy: priceBuy.toFixed(2),
          expiry_Date: new Date(Date.now() - expiredDaysAgo * 24 * 60 * 60 * 1000), // Expired in the past
          created_at: new Date(Date.now() - (expiredDaysAgo + 60) * 24 * 60 * 60 * 1000), // Created before expiry
        },
      })
    );
  }

  console.log(`Created ${expiredBatches.length} expired medicine batches`);

  // Create Purchases
  const purchases = [];
  const purchaseCount = 25;

  for (let i = 0; i < purchaseCount; i++) {
    const user = users[Math.floor(Math.random() * 3)]; // Admin or pharmacists
    const supplier = suppliers[Math.floor(Math.random() * suppliers.length)];
    const daysAgo = Math.floor(Math.random() * 120);
    
    const purchase = await prisma.pURCHASES.create({
      data: {
        user_id: user.id,
        supplier_id: supplier.id,
        total_amount: 0, // Will update after items
        purchase_date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });

    purchases.push(purchase);
  }

  console.log(`Created ${purchases.length} purchases`);

  // Create Purchase Items
  const purchaseItems = [];
  
  for (const purchase of purchases) {
    const itemCount = Math.floor(Math.random() * 5) + 2; // 2-6 items per purchase
    let purchaseTotal = 0;

    const supplierBatches = batches.filter(b => b.supplier_id === purchase.supplier_id);
    
    for (let i = 0; i < itemCount && i < supplierBatches.length; i++) {
      const batch = supplierBatches[Math.floor(Math.random() * supplierBatches.length)];
      const quantity = Math.floor(Math.random() * 100) + 50;
      const unitPrice = parseFloat(batch.price_buy);
      const subtotal = quantity * unitPrice;
      
      purchaseTotal += subtotal;

      purchaseItems.push(
        await prisma.pURCHASE_ITEMS.create({
          data: {
            purchase_id: purchase.id,
            medicine_id: batch.medicine_id,
            batch_id: batch.id,
            quantity,
            unit_price: unitPrice.toFixed(2),
            subtotal: subtotal.toFixed(2),
          },
        })
      );
    }

    // Update purchase total
    await prisma.pURCHASES.update({
      where: { id: purchase.id },
      data: { total_amount: purchaseTotal.toFixed(2) },
    });
  }

  console.log(`Created ${purchaseItems.length} purchase items`);

  // Create Sales
  const sales = [];
  const saleCount = 60;

  for (let i = 0; i < saleCount; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 90);
    const paymentMethods = ['cash', 'credit_card', 'debit_card', 'insurance'];
    
    const sale = await prisma.sALE.create({
      data: {
        user_id: user.id,
        total_amount: 0, // Will update after items
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        created_at: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });

    sales.push(sale);
  }

  console.log(`Created ${sales.length} sales`);

  // Create Sale Items
  const saleItems = [];
  
  for (const sale of sales) {
    const itemCount = Math.floor(Math.random() * 4) + 1; // 1-4 items per sale
    let saleTotal = 0;

    for (let i = 0; i < itemCount; i++) {
      const batch = batches[Math.floor(Math.random() * batches.length)];
      const medicine = medicines.find(m => m.id === batch.medicine_id);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const unitPrice = parseFloat(medicine.price_sell);
      const subtotal = quantity * unitPrice;
      
      saleTotal += subtotal;

      saleItems.push(
        await prisma.sALE_ITEMS.create({
          data: {
            sale_id: sale.id,
            medicine_id: medicine.id,
            batch_id: batch.id,
            quantity,
            unit_price: unitPrice.toFixed(2),
            subtotal: subtotal.toFixed(2),
          },
        })
      );
    }

    // Update sale total
    await prisma.sALE.update({
      where: { id: sale.id },
      data: { total_amount: saleTotal.toFixed(2) },
    });
  }

  console.log(`Created ${saleItems.length} sale items`);

  console.log('Seed completed successfully!');
  console.log('\n=== Summary ===');
  console.log(`Users: ${users.length}`);
  console.log(`Suppliers: ${suppliers.length}`);
  console.log(`Medicines: ${medicines.length}`);
  console.log(`Medicine Batches: ${batches.length}`);
  console.log(`Expired Batches: ${expiredBatches.length}`);
  console.log(`Total Batches: ${batches.length + expiredBatches.length}`);
  console.log(`Purchases: ${purchases.length}`);
  console.log(`Purchase Items: ${purchaseItems.length}`);
  console.log(`Sales: ${sales.length}`);
  console.log(`Sale Items: ${saleItems.length}`);
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });