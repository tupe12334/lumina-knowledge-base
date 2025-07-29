// prisma/seed/block-connections.seed.ts
import { Prisma } from '../../generated/client';
import { BlockConnectionData } from './block-connections.consts';

/**
 * Seeds block relationships based on provided connection data.
 *
 * @param tx The Prisma transaction client.
 * @param connections An array of BlockConnectionData objects defining the relationships.
 */
export async function seedBlockConnections(
  tx: Prisma.TransactionClient,
  connections: BlockConnectionData[],
) {
  console.log(`Seeding ${connections.length} block connections...`);

  for (const connection of connections) {
    try {
      await tx.blockRelationship.create({
        data: {
          id: connection.id,
          prerequisiteId: connection.prerequisiteBlockId,
          postrequisiteId: connection.postrequisiteBlockId,
          metadata: {
            create: connection.metadata?.map((meta) => ({
              id: meta.id,
              key: meta.key,
              value: meta.value,
            })),
          },
        },
      });
      console.log(`  Created block relationship: ${connection.id}`);
    } catch (error) {
      console.error(
        `  Error creating block relationship ${connection.id}:`,
        error,
      );
      // Depending on your seeding strategy, you might want to throw the error
      // or just log it and continue with other connections.
    }
  }

  console.log('Finished seeding block connections.');
}
