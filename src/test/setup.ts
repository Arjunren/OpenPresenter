import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

Object.defineProperty(URL, 'createObjectURL', {
  configurable: true,
  value: vi.fn(() => 'blob:openpresenter-test')
});

Object.defineProperty(URL, 'revokeObjectURL', {
  configurable: true,
  value: vi.fn()
});
