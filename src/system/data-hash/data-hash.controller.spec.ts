import { describe, it, expect, beforeEach } from 'vitest';
import { DataHashController } from './data-hash.controller';
import { DataHashService } from './data-hash.service';
import { ServiceUnavailableException } from '@nestjs/common';

type OptionalString = string | null;

export class MockDataHashService implements Pick<DataHashService, 'getHash'> {
  private value: OptionalString;

  constructor() {
    this.value = null;
  }

  set(hash: OptionalString) {
    this.value = hash;
  }
  getHash(): OptionalString {
    return this.value;
  }
}

describe('DataHashController', () => {
  let controller: DataHashController;
  let service: MockDataHashService;

  beforeEach(() => {
    service = new MockDataHashService();
    controller = new DataHashController(service as const as unknown as DataHashService);
  });

  it('returns hash when available', () => {
    service.set('abc123');
    const res = controller.getDbHash();
    expect(res).toEqual({ hash: 'abc123' });
  });

  it('throws 503 when hash not yet computed', () => {
    service.set(null);
    expect(() => controller.getDbHash()).toThrow(ServiceUnavailableException);
  });
});
