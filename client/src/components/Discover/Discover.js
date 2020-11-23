import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import Follow from '../Follow/Follow';
import axiosInstance from '../../axiosInstance/axiosInstance';

const useStyles = makeStyles((theme) => ({
  flex: {
    display: 'flex',
    paddingBottom: 7
  },
  padding: {
    padding: '15px 20px'
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 15
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
  },
  content: {
    flexGrow: 1,
    lineHeight: 1,
    maxWidth: 140,
    wordWrap: 'break-word'
  },
  paper: {
    marginBottom: 20
  }
}));

const Discover = () => {
  const classes = useStyles();
  const [discoveredUsers, setDiscoveredUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDiscoverUsers() {
      try {
        const response = await axiosInstance.get('/discover');
        setDiscoveredUsers(response.data);
      } catch (e) {
        setError(e.response ? e.response.data.message : e.message);
      }
    }

    fetchDiscoverUsers();
  }, []);

  return (
    <Paper className={classes.paper} variant="outlined">
      <div className={classes.padding}>
        <Typography variant="h6">
          Discover
        </Typography>
        {discoveredUsers.map(({
          _id, username, firstName, lastName
        }) => (
          <div className={classes.flex} key={_id}>
            <Avatar className={classes.avatar}>
              {`${firstName[0]}${lastName[0]}`.toUpperCase()}
            </Avatar>
            <div className={classes.content}>
              <Link className={classes.sender} component={RouterLink} to={`/user/${username}`} underline="none">
                <Typography className={classes.fullname}>
                  {`${firstName} ${lastName}`}
                </Typography>
                <Typography className={classes.username}>
                  {`@${username}`}
                </Typography>
              </Link>
            </div>
            <Follow isFollowed={false} username={username} />
          </div>
        ))}
      </div>
    </Paper>
  );
};

export default Discover;
