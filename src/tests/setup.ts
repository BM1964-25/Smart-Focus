import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach } from 'vitest';
import { resetDbConnectionForTests } from '../repositories/db';

afterEach(() => {
  resetDbConnectionForTests();
});
