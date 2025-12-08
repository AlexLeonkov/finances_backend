import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const results: any[] = [];

  // Replace 'data.csv' with your actual filename if different
  fs.createReadStream('data.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} rows from CSV.`);

      for (const row of results) {
        // Map CSV columns to database fields
        // Adjust the keys (e.g. '№ счета') to match your EXACT CSV headers
        const operationData = {
          invoiceNumber: row['№ счета'] || row['Invoice'], // Try multiple names just in case
          members: row['Группа'] || '',
          revenue: parseFloat((row['Сумма счета'] || '0').replace(/[€\s]/g, '').replace(',', '.').trim()), // Clean currency symbols and spaces
          materialCost: parseFloat((row['Материалы'] || '0').replace(/[€\s]/g, '').replace(',', '.').trim()) || null,
          fuelCost: parseFloat((row['Бензин/ износ машины'] || row['Бензин'] || '0').replace(/[€\s]/g, '').replace(',', '.').trim()),
          profit: parseFloat((row['Рентабельность'] || '0').replace(/[€\s]/g, '').replace(',', '.').trim()),
          team: row['Команда'] || row['Team'] || null, // Assuming column J has a header like 'Team' or is empty
          
          // These fields are not in your screenshot/CSV explicitly, providing defaults
          isPaid: false, 
          date: new Date(), // You might want to parse '01.12.25' from the invoice string if needed
        };

        // Try to extract date from Invoice string. Supports "01.12.25" or "25.11" (defaults to 2025)
        const dateMatch = operationData.invoiceNumber?.match(/(\d{1,2})\.(\d{1,2})(?:\.(\d{2,4}))?/);
        if (dateMatch) {
          const day = dateMatch[1].padStart(2, '0');
          const month = dateMatch[2].padStart(2, '0');
          let year = '2025'; // Default year if missing

          if (dateMatch[3]) {
             // If year exists in string (e.g. "25" or "2025")
             year = dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3];
          }

          operationData.date = new Date(`${year}-${month}-${day}`);
        }

        try {
          await prisma.operation.create({
            data: operationData,
          });
          console.log(`Imported: ${operationData.invoiceNumber}`);
        } catch (e) {
          console.error(`Error importing ${operationData.invoiceNumber}:`, e);
        }
      }

      console.log('Done!');
      await prisma.$disconnect();
    });
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

