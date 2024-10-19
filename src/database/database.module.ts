import { neon } from '@neondatabase/serverless';
import { Module } from '@nestjs/common';
import { config } from 'dotenv';
import { DatabaseService } from './database.service';

config({
  path: ['.env', '.env.production', '.env.local'],
})

const sql = neon(process.env.DATABASE_URL);


const dbProvider = {
  provide: 'POSTGRES_POOL',
  useValue: sql,
}

@Module({
  providers: [dbProvider, DatabaseService],
  exports: [dbProvider],
})
export class DatabaseModule {}
