import { db } from './src/db';
import { loans, payments } from './src/db/schema';

async function seed() {
    console.log('Seeding...');

    const [loan] = await db.insert(loans).values({
        name: 'Préstamo de Prueba (Tech UI)',
        principal: 10000000,
        annualInterestRate: 15,
        termMonths: 24,
        startDate: new Date().toISOString().split('T')[0],
        remainingBalance: 10000000,
        status: 'active',
    }).returning();

    console.log('Loan created:', loan.id);
    process.exit(0);
}

seed().catch(console.error);
