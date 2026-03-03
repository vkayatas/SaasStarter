import type { z } from 'zod';

export interface LoaderResult {
  total: number;
  inserted: number;
  updated: number;
  skipped: number;
}

export abstract class BaseLoader<T> {
  abstract name: string;
  abstract fetch(): Promise<T[]>;
  abstract validate(item: T): z.SafeParseReturnType<T, T>;
  abstract upsert(items: T[]): Promise<{ inserted: number; updated: number }>;

  async run(): Promise<LoaderResult> {
    const raw = await this.fetch();
    const valid = raw.filter((item) => this.validate(item).success);
    const invalid = raw.length - valid.length;
    const result = await this.upsert(valid);
    await this.logResult({ ...result, skipped: invalid, total: raw.length });
    return { ...result, skipped: invalid, total: raw.length };
  }

  protected async logResult(result: LoaderResult): Promise<void> {
    console.log(
      `[${this.name}] Total: ${result.total}, Inserted: ${result.inserted}, ` +
        `Updated: ${result.updated}, Skipped: ${result.skipped}`,
    );
  }
}
