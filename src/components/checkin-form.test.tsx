import React from 'react';
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock server action module to avoid importing next/cache in tests
vi.mock('@/app/actions', () => ({
  submitCheckin: vi.fn(async () => {}),
}));

import { CheckinForm } from './checkin-form';
import { todayLocal } from '@/lib/date';

describe('CheckinForm', () => {
  const fixedNow = new Date('2025-01-10T12:00:00Z');

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('renders radios, textarea, and hidden date with today default', () => {
    render(<CheckinForm />);

    const ok = screen.getByLabelText('On track (no YouTube)') as HTMLInputElement;
    const slip = screen.getByLabelText('Slip') as HTMLInputElement;
    expect(ok).toBeInTheDocument();
    expect(slip).toBeInTheDocument();
    expect(ok.checked).toBe(true);
    expect(slip.checked).toBe(false);

    const note = screen.getByPlaceholderText('Optional note (what helped or what went wrong)');
    expect(note).toBeInTheDocument();

    const hiddenDate = document.querySelector('input[type="hidden"][name="date"]') as HTMLInputElement | null;
    expect(hiddenDate).not.toBeNull();
    expect(hiddenDate!.value).toBe(todayLocal());
  });

  it('respects provided defaults', () => {
    render(<CheckinForm defaultStatus="slip" defaultNote="hello" />);

    const ok = screen.getByLabelText('On track (no YouTube)') as HTMLInputElement;
    const slip = screen.getByLabelText('Slip') as HTMLInputElement;
    expect(ok.checked).toBe(false);
    expect(slip.checked).toBe(true);
    expect(screen.getByDisplayValue('hello')).toBeInTheDocument();
  });
});
