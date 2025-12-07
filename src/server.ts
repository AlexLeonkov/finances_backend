import express, { Request, Response } from 'express';
import { prisma } from './prisma';

const app = express();
const PORT = process.env.PORT || 3000;

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
    const { name, team, date, revenue, profit } = req.body;

    // Simple validation
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Invalid name' });
    }
    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Invalid date (expecting ISO string)' });
    }
    if (revenue === undefined || typeof revenue !== 'number') {
      return res.status(400).json({ error: 'Invalid revenue (expecting number)' });
    }
    if (profit === undefined || typeof profit !== 'number') {
      return res.status(400).json({ error: 'Invalid profit (expecting number)' });
    }

    const newOperation = await prisma.operation.create({
      data: {
        name,
        team: team || null, // Optional
        date: new Date(date),
        revenue,
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
