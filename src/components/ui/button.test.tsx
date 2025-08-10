import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with text and respects disabled', () => {
    render(<Button disabled>Click me</Button>);
    const btn = screen.getByRole('button', { name: 'Click me' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('disabled');
  });
});
