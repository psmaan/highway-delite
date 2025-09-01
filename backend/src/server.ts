import { app } from './app.ts';
import { connectDB } from './db/connect.ts';
import { env } from './config/env.ts';

async function bootstrap() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`Server is running at http://localhost:${env.PORT}`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});
