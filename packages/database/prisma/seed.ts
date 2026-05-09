import process from 'node:process';
import {
  products,
  productTypes,
  eventRequests,
  eventTypes,
} from './constants.js';
import { prisma } from '../src/client.js';

async function main() {
  console.log('Start seeding...');

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE "product", "product_category", "event_request", "event_type" CASCADE;`,
  );
  console.log('Tables truncated.');

  for (const type of productTypes) {
    try {
      const created = await prisma.productCategory.create({
        data: {
          ...type,
          updated_at: new Date(),
        },
      });
      console.log(
        `Created product category: ${created.name} (id: ${created.id})`,
      );
    } catch (error) {
      console.error(`Failed to create product type ${type.name}:`, error);
      throw error;
    }
  }

  for (const product of products) {
    try {
      const created = await prisma.product.create({
        data: {
          ...product,
          updated_at: new Date(),
        },
      });
      console.log(`Created product: ${created.id}`);
    } catch (error) {
      console.error(`Failed to create product ${product.image}:`, error);
      throw error;
    }
  }

  for (const type of eventTypes) {
    try {
      const created = await prisma.eventType.create({
        data: type,
      });
      console.log(`Created event type: ${created.name} (id: ${created.id})`);
    } catch (error) {
      console.error(`Failed to create event type ${type.name}:`, error);
      throw error;
    }
  }

  for (const request of eventRequests) {
    try {
      const created = await prisma.eventRequest.create({
        data: request,
      });
      console.log(`Created event request: ${created.id}`);
    } catch (error) {
      console.error(`Failed to create event request ${request.id}:`, error);
      throw error;
    }
  }

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('Seed script failed with error:');
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
