import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex'
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  recipient: {
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    fontSize: 14
  },
  date: {
    color: theme.palette.text.secondary,
    fontSize: 12
  },
  height: {
    lineHeight: 1
  }
}));

const QuestionLayoutMeta = ({ recipient, time }) => {
  const classes = useStyles();

  return (recipient ? (
    <div className={classes.flex}>
      <Avatar className={classes.avatar}>
        {`${recipient.firstName[0]}${recipient.lastName[0]}`.toUpperCase()}
      </Avatar>

      <div className={classes.height}>
        <Link component={RouterLink} to={`/user/${recipient.username}`} underline="none">
          <Typography className={classes.recipient}>
            {`${recipient.firstName} ${recipient.lastName}`}
          </Typography>
        </Link>
        <span className={classes.date}>
          {new Date(time).toLocaleString()}
        </span>
      </div>
    </div>
  ) : (
    <span className={classes.date}>
      {new Date(time).toLocaleString()}
    </span>
  )
  );
};

QuestionLayoutMeta.propTypes = {
  recipient: PropTypes.object,
  time: PropTypes.string.isRequired
};

export default QuestionLayoutMeta;
