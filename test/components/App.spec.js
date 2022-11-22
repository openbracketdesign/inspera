import { render, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import React from 'react';
import * as reactRedux from 'react-redux';
import { Provider } from 'react-redux';
import timeService from '../../src/services/timeService';
import App from '../../src/components/App';

jest.mock('../../src/services/timeService', () => ({
    requestUpdatedTime: jest.fn().mockResolvedValue(35),
}));
jest.useFakeTimers();

const mockChildComponent = jest.fn();
jest.mock('../../src/components/header/Header.js', () => (props) => {
    mockChildComponent(props);
    return <mock-childComponent />;
});

const mockStore = configureStore([]);
let store;

const mockUseDispatch = jest.spyOn(reactRedux, 'useDispatch');
const mockDispatch = jest.fn().mockImplementation(() => {
    store = mockStore({
        time: {
            timeRemaining: 35,
        },
    });
});
mockUseDispatch.mockReturnValue(mockDispatch);

beforeEach(() => {
    store = mockStore({
        time: {
            timeRemaining: 0,
        },
    });
});
afterEach(() => {
    mockChildComponent.mockClear();
    timeService.requestUpdatedTime.mockClear();
});

describe('App component', () => {
    describe('MOUNT useEffect', () => {
        it('calls API again after 10 seconds', async () => {
            render(<Provider store={store}><App /></Provider>);
            await waitFor(() => expect(timeService.requestUpdatedTime).toHaveBeenCalled());
            act(() => jest.advanceTimersByTime(10000));
            expect(timeService.requestUpdatedTime).toHaveBeenCalledTimes(2);
        });

        // test that prop passed to header matches store state on load and re-render after dispatch
        it('renders header with initial timer and updated value when timeRemaining changes', async () => {
            const { rerender } = render(<Provider store={store}><App /></Provider>);
            await waitFor(() => expect(timeService.requestUpdatedTime).toHaveBeenCalledTimes(1));
            expect(mockChildComponent).toHaveBeenCalledWith(
                expect.objectContaining({
                    timeRemaining: 0,
                }),
            );
            rerender(<Provider store={store}><App /></Provider>);
            expect(mockChildComponent).toHaveBeenCalledWith(
                expect.objectContaining({
                    timeRemaining: 35,
                }),
            );
        });

        it('passes new prop value to header when timeRemaining changes', async () => {
            store = mockStore({
                time: {
                    timeRemaining: 35,
                },
            });
            const { getByRole } = render(<Provider store={store}><App /></Provider>);
            await waitFor(() => expect(timeService.requestUpdatedTime).toHaveBeenCalledTimes(1));
            await waitFor(() => expect(getByRole('application')).toBeTruthy());
            act(() => jest.advanceTimersByTime(1000)); // wait 1 sec
            expect(mockChildComponent).toHaveBeenCalledWith(
                expect.objectContaining({
                    timeRemaining: 34, // time reduced by 1 sec and passed to header
                }),
            );
        });
    });
});
