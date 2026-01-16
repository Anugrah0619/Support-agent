const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
    },
  });

  // 2. Create a conversation
  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
    },
  });

  // 3. Create messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        sender: 'user',
        text: 'I placed an order yesterday',
      },
      {
        conversationId: conversation.id,
        sender: 'agent',
        text: 'Let me check the order status for you',
      },
    ],
  });

  // 4. Create an order
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      status: 'shipped',
    },
  });

  // 5. Create a payment
  await prisma.payment.create({
    data: {
      orderId: order.id,
      status: 'paid',
    },
  });

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
