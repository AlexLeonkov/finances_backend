import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (development mode)
app.use(cors());

app.use(express.json());

// GET /operations - List all operations ordered by date desc
app.get('/operations', async (req: Request, res: Response) => {
  try {
    const operations = await prisma.operation.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    res.json(operations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /operations - Create a new operation
app.post('/operations', async (req: Request, res: Response) => {
  try {
    const { 
      invoiceNumber, 
      team, 
      members, 
      date, 
      revenue, 
      materialCost, 
      fuelCost, 
      isPaid, 
      profit 
    } = req.body;

    // Simple validation (checking required fields)
    if (!invoiceNumber || typeof invoiceNumber !== 'string') {
      return res.status(400).json({ error: 'Invalid invoiceNumber' });
    }
    if (!members || typeof members !== 'string') {
      return res.status(400).json({ error: 'Invalid members' });
    }
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Invalid date (expecting ISO string)' });
    }
    if (revenue === undefined || typeof revenue !== 'number') {
      return res.status(400).json({ error: 'Invalid revenue' });
    }
    if (fuelCost === undefined || typeof fuelCost !== 'number') {
      return res.status(400).json({ error: 'Invalid fuelCost' });
    }
    // isPaid is optional or handled with default false in logic if undefined, 
    // but here strict check. Let's make it robust:
    const finalIsPaid = typeof isPaid === 'boolean' ? isPaid : false;
    
    if (profit === undefined || typeof profit !== 'number') {
      return res.status(400).json({ error: 'Invalid profit' });
    }

    const newOperation = await prisma.operation.create({
      data: {
        invoiceNumber,
        team: team || null,
        members,
        date: new Date(date),
        revenue,
        materialCost: materialCost || null, // Optional
        fuelCost,
        isPaid: finalIsPaid,
        profit,
      },
    });

    res.status(201).json(newOperation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
