import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { FilterModal } from '../../src/components/FilterModal';
import type { FilterState } from '../../src/types';

describe('UI & Button Interactions: Discover Filters Modal', () => {
  const initialFilters: FilterState = {
    minAge: 20,
    maxAge: 32,
    maxDistance: 45,
    sects: ['Sunni'],
    practiceLevels: ['practicing'],
    marriageTimelines: ['within_1_year'],
    languages: ['English']
  };

  it('1. Renders Filter Modal with initial filters active', () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <FilterModal
        filters={initialFilters}
        onClose={handleClose}
        onApply={handleApply}
      />
    );

    // Header title
    expect(screen.getByText('Preferences & Filters')).toBeDefined();
    expect(screen.getByRole('button', { name: /Reset/i })).toBeDefined();

    // Age and Distance indicators
    expect(screen.getByText(/20 – 32 years/i)).toBeDefined();
    expect(screen.getByText(/45 miles/i)).toBeDefined();

    // Sect & Practice options
    expect(screen.getByRole('button', { name: /Sunni/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Shia/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Practicing \(5 Daily Prayers\)/i })).toBeDefined();

    // Apply button
    expect(screen.getByRole('button', { name: /Apply Selected Filters/i })).toBeDefined();
  });

  it('2. Toggling filters and clicking Apply calls onApply with updated state', () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <FilterModal
        filters={initialFilters}
        onClose={handleClose}
        onApply={handleApply}
      />
    );

    // Toggle another sect (e.g. Just Muslim)
    const justMuslimBtn = screen.getByRole('button', { name: /Just Muslim/i });
    fireEvent.click(justMuslimBtn);

    // Click Apply
    const applyBtn = screen.getByRole('button', { name: /Apply Selected Filters/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        sects: ['Sunni', 'Just Muslim']
      })
    );
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('3. Resetting filters restores default values and allows applying defaults', () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <FilterModal
        filters={initialFilters}
        onClose={handleClose}
        onApply={handleApply}
      />
    );

    // Click Reset
    const resetBtn = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetBtn);

    // Verify age reset in the UI
    expect(screen.getByText(/18 – 50 years/i)).toBeDefined();
    expect(screen.getByText(/50 miles/i)).toBeDefined();

    // Apply the reset filters
    const applyBtn = screen.getByRole('button', { name: /Apply Selected Filters/i });
    fireEvent.click(applyBtn);

    expect(handleApply).toHaveBeenCalledWith(
      expect.objectContaining({
        minAge: 18,
        maxAge: 50,
        maxDistance: 50,
        sects: [],
        practiceLevels: [],
        marriageTimelines: []
      })
    );
  });

  it('4. Clicking close button invokes onClose without applying changes', () => {
    const handleClose = vi.fn();
    const handleApply = vi.fn();

    render(
      <FilterModal
        filters={initialFilters}
        onClose={handleClose}
        onApply={handleApply}
      />
    );

    // The close button is the first button (containing the X icon)
    const closeButtons = screen.getAllByRole('button');
    // Top-left X button
    fireEvent.click(closeButtons[0]);

    expect(handleClose).toHaveBeenCalledTimes(1);
    expect(handleApply).not.toHaveBeenCalled();
  });
});
