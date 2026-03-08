import { prisma } from '../lib/prisma';

async function checkUser() {
  try {
    console.log('Checking database connection...');
    
    // Check all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    console.log('\n=== Users in Database ===');
    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log('\nYou need to sign up or sign in to create a user.');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Created: ${user.createdAt}`);
      });
    }

    // Check transactions
    const transactions = await prisma.transaction.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
        amount: true,
      },
      take: 5,
    });

    console.log('\n=== Recent Transactions ===');
    if (transactions.length === 0) {
      console.log('No transactions found.');
    } else {
      console.log(`Found ${transactions.length} transaction(s):`);
      transactions.forEach((t, index) => {
        console.log(`${index + 1}. ${t.type} - $${t.amount} (User: ${t.userId})`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkUser();

// Made with Bob
