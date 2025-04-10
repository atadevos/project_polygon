import { render, screen, fireEvent } from '@testing-library/react';
import PolygonCreate, { PolygonNameErrorEvent } from './PolygonCreateForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppStateEnum } from '../type/types';
import React from 'react';

const defaultProps = {
    appState: {
        state: AppStateEnum.IDLE,
        payload: {},
    },
    reset: vi.fn(),
    createPolygon: vi.fn(),
    onDelete: vi.fn(),
    toggleSelect: vi.fn(),
};

describe('PolygonCreate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders input and button', () => {
        render(<PolygonCreate {...defaultProps} />);
        expect(screen.getByPlaceholderText('Polygon Name')).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Start/i})).toBeInTheDocument();
    });

    it('check if update input value when typing', () => {
        render(<PolygonCreate {...defaultProps} />);
        const input = screen.getByPlaceholderText('Polygon Name') as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Triangle' } });
        expect(input.value).toBe('Triangle');
    });

    it('calls createPolygon with name and empty points', () => {
        render(<PolygonCreate {...defaultProps} />);
        const input = screen.getByPlaceholderText('Polygon Name');
        const button = screen.getByRole('button', {name: /Start/i});

        fireEvent.change(input, { target: { value: 'New Polygon' } });
        fireEvent.click(button);

        expect(defaultProps.createPolygon).toHaveBeenCalledWith('New Polygon');
    });

    it('disables the button if name is empty', () => {
        render(
          <PolygonCreate {...defaultProps}
          />
        );

        const button = screen.getByRole('button', { name: /start/i });

        expect(button).toBeDisabled();
      });

    it('disables button if appState is not allowed', () => {
        const state = {
            ...defaultProps,
            appState: {
                state: AppStateEnum.SAVEING_DRAWING,
                payload: {},
            },
        };
        render(<PolygonCreate {...state} />);
        expect(screen.getByRole('button', {name: /Start/i})).toBeDisabled();
    });

    it('shows red border when polygonNameError is present', () => {
        const errorState = {
            ...defaultProps,
            appState: {
                state: AppStateEnum.ERROR_SAVING_DRAWING,
                payload: {
                    polygonNameError: 'Name is required',
                },
            },
        };
        render(<PolygonCreate {...errorState} />);
        const input = screen.getByPlaceholderText('Polygon Name');
        expect(input.className).toContain('border-red-500');
    });


    for(const state of Object.values(AppStateEnum)) {
        if ([AppStateEnum.IDLE, AppStateEnum.DRAWING, AppStateEnum.ERROR_SAVING_DRAWING].includes(state)) continue;
        it('disable create button when app state is not in idle, drawing or error', () => {
            const errorState = {
                ...defaultProps,
                appState: {
                    state: state,
                },
            };
            render(<PolygonCreate {...errorState} />);
            expect(screen.getByRole('button', {name: /Start/i})).toBeDisabled();
        });
    }

    it('if app is in drawing state, button text should be as Save', () => {
        const errorState = {
            ...defaultProps,
            appState: {
                state: AppStateEnum.DRAWING,
            },
        };
        render(<PolygonCreate {...errorState} />);
        expect(screen.getByRole('button', {name: /save/i})).toHaveTextContent('Save');
    });
});
