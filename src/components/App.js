import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setRemainingTime } from '../actions/timeActions';
import timeService from '../services/timeService';
import Header from './header/Header';

import './App.scss';

const GET_REMAINING_TIME_TIMER = 10 * 1000;
let apiInterval;
let localInterval;

const App = () => {
    const timeRemainingState = useSelector((state) => state.time.timeRemaining);
    const dispatch = useDispatch();

    /*
      If dark mode was used further down the component tree or
      updated by more components, context or store state would be the way to go.
      As the exam form is directly within App and the Header is the only component
      to update dark mode, local state is OK for now.
    */
    const [darkMode, setDarkMode] = useState(false);
    const [localTime, setLocalTime] = useState(0);

    const updateTime = async () => {
        const timeRemaining = await timeService.requestUpdatedTime();
        dispatch(setRemainingTime(timeRemaining));
    };

    const toggleDarkModeHandler = () => {
        setDarkMode((prev) => !prev);
    };

    useEffect(async () => {
        await updateTime();
        apiInterval = setInterval(() => {
            updateTime();
        }, GET_REMAINING_TIME_TIMER);

        return () => {
            clearInterval(apiInterval);
        };
    }, []);

    // set up per-second interval for local timer, counting down from store/api value
    // could be combined with useEffect above if needed
    useEffect(() => {
        localInterval = setInterval(() => {
            setLocalTime((prev) => (prev > 0 ? prev - 1 : 0)); // don't go below 0
        }, 1000);

        return () => {
            clearInterval(localInterval);
        };
    }, []);

    useEffect(async () => {
        // when time remaining changes in store from api, update local timer to match
        setLocalTime(timeRemainingState);
    }, [timeRemainingState]);

    return (
        <div className="app-wrapper default" data-test-id="App" role="application" aria-label="Inspera exam window">
            <Header
                darkMode={darkMode}
                timeRemaining={localTime}
                toggleDarkModeHandler={toggleDarkModeHandler}
            />
            <div className="body" role="main" aria-label="Inspera exam questions">
                <h1>Welcome to your Inspera exam</h1>
                <hr />
                <div className="text-interaction">
                    <label htmlFor="test-text-input">
                        <p id="test-text-input-label">What is your answer?</p>
                        <input name="test-text-input" id="test-text-input" placeholder="Type your text here..." type="text" aria-labelledby="test-text-input-label" />
                    </label>
                </div>
                <hr />
                <div className={`mpc-interaction ${darkMode ? 'mpc-interaction--dark' : 'mpc-interaction--light'}`}>
                    <label htmlFor="checkbox1">
                        <input name="checkbox1" id="checkbox1" type="checkbox" value="Alternative 1" aria-labelledby="checkbox1-label" />
                        <p id="checkbox1-label">Alternative 1</p>
                    </label>
                    <label htmlFor="checkbox2">
                        <input name="checkbox2" id="checkbox2" type="checkbox" value="Alternative 2" aria-labelledby="checkbox2-label" />
                        <p id="checkbox2-label">Alternative 2</p>
                    </label>
                    <label htmlFor="checkbox3">
                        <input name="checkbox3" id="checkbox3" type="checkbox" value="Alternative 3" aria-labelledby="checkbox3-label" />
                        <p id="checkbox3-label">Alternative 3</p>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default App;
