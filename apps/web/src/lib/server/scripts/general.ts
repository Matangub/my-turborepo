import { generateMock } from '@anatine/zod-mock';
import { faker } from '@faker-js/faker';
const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam auctor purus lorem, a varius mauris finibus nec. Mauris nulla nulla, ultrices in congue dapibus, pretium et purus. Fusce sit amet consequat nulla, quis cursus sem. Maecenas tempus, lectus non pellentesque accumsan, nunc velit porta elit, vel iaculis mi elit in eros. Nullam in placerat metus, sed congue quam. Nullam maximus mattis tellus, rutrum varius nunc. Integer sit amet tellus a augue maximus ullamcorper a id tellus. Ut et ligula porta, venenatis ex vitae, suscipit mauris.`;

import { badges, insertJobWithBadges, jobs, user } from '../../schema';
import { seedingDb } from './utils';
import { sql } from 'drizzle-orm';

async function emptyDatabase() {
  await seedingDb.execute(
    sql`truncate table "jobs", "badges", "user", "user_key", "user_session" cascade`
  );
}

async function seedDatabase() {
  // Seed the database with fake data
  for (let i = 0; i < 30; i++) {
    const createdUser = (
      await seedingDb
        .insert(user)
        .values({ id: faker.string.uuid(), username: faker.internet.userName() })
        .returning()
    )[0];

    // Change the number of entries as needed
    const { badges: fakeBadges, ...job } = generateMock(insertJobWithBadges);

    // Insert job data
    await seedingDb
      .insert(jobs)
      .values({ ...job, title: `Job ${i}`, description, user_id: createdUser.id });

    // Insert badge data
    for (const badge of fakeBadges) {
      await seedingDb.insert(badges).values({
        label: badge,
        jobs_id: job.id!
      });
    }
  }
}

// Call the function to seed the database
await emptyDatabase();
await seedDatabase();
process.exit();
