import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import User from '../../User/User';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex'
  },
  date: {
    color: theme.palette.text.secondary,
    fontSize: 12
  }
}));

const QuestionLayoutMeta = ({ recipient, time }) => {
  const classes = useStyles();

  return (
    <div className={classes.flex}>
      {recipient && (
      <User
        fullName={`${recipient.firstName} ${recipient.lastName}`}
        username={recipient.username}
        isSidebar={false}
      />
      )}
      <span className={classes.date}>
        {new Date(time).toLocaleString()}
      </span>
    </div>
  );
};

QuestionLayoutMeta.propTypes = {
  recipient: PropTypes.object,
  time: PropTypes.string.isRequired
};

export default QuestionLayoutMeta;
