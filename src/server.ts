import express, { Request, Response } from 'express';
import cors from 'cors';
import { prisma } from './prisma';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (development mode)
app.use(cors());

app.use(express.json());

// GET /dashboard - Aggregate stats (optionally filtered by date)
app.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    const where: any = {};
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    // 1. Get total stats
    const totalStats = await prisma.operation.aggregate({
      where,
      _sum: {
        revenue: true,
        profit: true,
        fuelCost: true,
        materialCost: true,
      },
      _count: {
        id: true,
      },
    });

    // 2. Get stats grouped by team
    const teamStats = await prisma.operation.groupBy({
      by: ['team'],
      where,
      _sum: {
        revenue: true,
        profit: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _sum: {
          revenue: 'desc',
        },
      },
    });

    res.json({
      period: {
        start: startDate || 'all-time',
        end: endDate || 'now',
      },
      totals: {
        operations: totalStats._count.id,
        revenue: totalStats._sum.revenue || 0,
        profit: totalStats._sum.profit || 0,
        expenses: (totalStats._sum.fuelCost || 0) + (totalStats._sum.materialCost || 0),
      },
      teams: teamStats.map(t => ({
        name: t.team || 'Unknown',
        operations: t._count.id,
        revenue: t._sum.revenue || 0,
        profit: t._sum.profit || 0,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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
