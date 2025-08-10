import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsCard } from './stats-card';

describe('StatsCard', () => {
  it('renders progress stats', () => {
    const stats = {
      totalOk: 5,
      totalSlip: 2,
      currentStreak: 3,
      bestStreak: 4,
      lastSlipDate: '2025-01-05',
    };
    render(<StatsCard stats={stats} />);

    expect(screen.getByText('Progress')).toBeInTheDocument();
    expect(screen.getByText('Current Streak')).toBeInTheDocument();
    expect(screen.getByText('Best Streak')).toBeInTheDocument();
    expect(screen.getByText('Total OK')).toBeInTheDocument();
    expect(screen.getByText('Total Slips')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Last slip: 2025-01-05/)).toBeInTheDocument();
  });
});
