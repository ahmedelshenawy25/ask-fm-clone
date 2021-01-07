import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15
  },
  content: {
    flexGrow: 1,
    lineHeight: 1,
    wordWrap: 'break-word'
  },
  contentSidebar: {
    flexGrow: 1,
    lineHeight: 1,
    maxWidth: 140,
    wordWrap: 'break-word'
  },
  fullname: {
    color: theme.palette.text.primary,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: 1
  },
  username: {
    color: theme.palette.text.secondary,
    fontSize: 12
  }
}));

const User = ({ fullName, username, isSidebar }) => {
  const classes = useStyles();

  return (
    <>
      <Avatar className={classes.avatar} />
      <div className={isSidebar ? classes.contentSidebar : classes.content}>
        <Link
          component={RouterLink}
          to={`/user/${username}`}
          underline="none"
        >
          <Typography className={classes.fullname}>
            {fullName}
          </Typography>
          <Typography className={classes.username}>
            {`@${username}`}
          </Typography>
        </Link>
      </div>
    </>
  );
};

User.propTypes = {
  fullName: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  isSidebar: PropTypes.bool.isRequired
};

export default User;
