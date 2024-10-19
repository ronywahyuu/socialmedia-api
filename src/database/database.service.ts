import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseService {
  constructor(@Inject('POSTGRES_POOL') private readonly sql:any) {}

  async getTable(name: string): Promise<any> {
    return this.sql`SELECT * FROM ${name}`;
  }
}
