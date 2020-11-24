import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles({
  margin: {
    marginBottom: 10
  },
  question: {
    display: 'inline',
    fontWeight: 'bold',
    fontSize: 19,
    wordWrap: 'break-word',
    lineHeight: 1.3
  },
  avatar: {
    fontSize: 14,
    width: 20,
    height: 20,
    marginRight: 5
  },
  sender: {
    display: 'inline-flex',
    padding: '0 5px'
  }
});

const QuestionLayoutHeader = ({ question, sender }) => {
  const classes = useStyles();

  return (
    <div className={classes.margin}>
      <Typography className={classes.question}>
        {question}
      </Typography>
      {sender && (
      <div className={classes.sender}>
        <Link className={classes.sender} component={RouterLink} to={`/user/${sender.username}`} underline="none">
          <Avatar className={classes.avatar}>
            {`${sender.firstName[0]}${sender.lastName[0]}`.toUpperCase()}
          </Avatar>
          <Typography variant="caption">
            {`${sender.firstName} ${sender.lastName}`}
          </Typography>
        </Link>
      </div>
      )}
    </div>
  );
};

QuestionLayoutHeader.propTypes = {
  question: PropTypes.string.isRequired,
  sender: PropTypes.object
};

export default QuestionLayoutHeader;
