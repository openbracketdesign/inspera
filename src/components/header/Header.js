import React from 'react';
import './Header.scss';
import PropTypes from 'prop-types';

const Header = ({ timeRemaining, darkMode, toggleDarkModeHandler }) => (
    <div className={`header ${darkMode ? 'header--dark' : 'header--light'}`} role="banner" aria-label="Inspera exam header">
        <div className="header__content">
            <div className="candidate">Front-end Test Candidate</div>
            <div className="time-remaining">
                {timeRemaining}
                {' '}
                second
                {timeRemaining !== 1 ? 's' : ''}
                {' '}
                remaining
            </div>
        </div>
        <button
            onClick={toggleDarkModeHandler}
            type="button"
            className="theme-toggle"
        >
            {darkMode ? 'Light mode 🌝' : 'Dark mode 🌚'}
        </button>
    </div>
);
Header.propTypes = {
    timeRemaining: PropTypes.number.isRequired,
    darkMode: PropTypes.bool.isRequired,
    toggleDarkModeHandler: PropTypes.func.isRequired,
};

export default Header;
