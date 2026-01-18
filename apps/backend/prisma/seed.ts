import 'dotenv/config';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TEST dataset for context validation...');

  // Clean DB
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();

  /* ===============================
     USER 1 – ORDER CONTEXT
     =============================== */
  const user1 = await prisma.user.create({
    data: { name: 'Order User' },
  });

  const conv1 = await prisma.conversation.create({
    data: { userId: user1.id },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv1.id, sender: 'user', text: 'Where is my order?' },
      { conversationId: conv1.id, sender: 'user', text: 'When will it arrive?' },
    ],
  });

  await prisma.order.create({
    data: { userId: user1.id, status: 'shipped' },
  });

  /* ===============================
     USER 2 – SUPPORT CONTEXT
     =============================== */
  const user2 = await prisma.user.create({
    data: { name: 'Support User' },
  });

  const conv2 = await prisma.conversation.create({
    data: { userId: user2.id },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv2.id,
        sender: 'user',
        text: 'My app crashes when I open it',
      },
      {
        conversationId: conv2.id,
        sender: 'user',
        text: 'It still does not work',
      },
    ],
  });

  /* ===============================
     USER 3 – BILLING CONTEXT
     =============================== */
  const user3 = await prisma.user.create({
    data: { name: 'Billing User' },
  });

  const conv3 = await prisma.conversation.create({
    data: { userId: user3.id },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv3.id, sender: 'user', text: 'My refund status?' },
      {
        conversationId: conv3.id,
        sender: 'user',
        text: 'How long will it take?',
      },
    ],
  });

  /* ===============================
     USER 4 – CONTEXT SWITCH
     =============================== */
  const user4 = await prisma.user.create({
    data: { name: 'Switch User' },
  });

  const conv4 = await prisma.conversation.create({
    data: { userId: user4.id },
  });

  await prisma.message.createMany({
    data: [
      { conversationId: conv4.id, sender: 'user', text: 'Where is my order?' },
      {
        conversationId: conv4.id,
        sender: 'user',
        text: 'My app is crashing now',
      },
    ],
  });

  await prisma.order.create({
    data: { userId: user4.id, status: 'delivered' },
  });

  /* ===============================
     USER 5 – AMBIGUOUS CONTEXT
     =============================== */
  const user5 = await prisma.user.create({
    data: { name: 'Ambiguous User' },
  });

  const conv5 = await prisma.conversation.create({
    data: { userId: user5.id },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conv5.id,
        sender: 'user',
        text: 'I need help with the app',
      },
      {
        conversationId: conv5.id,
        sender: 'user',
        text: 'It is not working',
      },
    ],
  });

  console.log('✅ Test dataset seeded successfully');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
