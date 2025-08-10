import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Textarea } from './textarea';

describe('Textarea', () => {
  it('renders with placeholder and default value', () => {
    render(<Textarea placeholder="Type here" defaultValue="hello" />);
    const el = screen.getByPlaceholderText('Type here') as HTMLTextAreaElement;
    expect(el).toBeInTheDocument();
    expect(el.value).toBe('hello');
  });
});
