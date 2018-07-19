import React from 'react';
import PropTypes from 'prop-types';
// Import style
import './Notification.scss';

const Notification = ({
  text, state
}) => {
  const notifShow = (text !== '') ? `showNotif notif ${state}` : 'notif';
  return (
    <div className={notifShow}>
      <span>{text}</span>
    </div>
  );
};

Notification.propTypes = {
  text: PropTypes.string,
  state: PropTypes.string
};

Notification.defaultProps = { // define the default props
  text: '',
  state: 'info'
};
export default Notification;
