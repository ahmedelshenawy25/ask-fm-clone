import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import InputLabel from '@material-ui/core/InputLabel';
import axiosInstance from '../../axiosInstance/axiosInstance';
import Follow from '../Follow/Follow';
import askFormValidationSchema from './askForm.validationSchema';
import ErrorContext from '../../context/ErrorContext';

const useStyles = makeStyles({
  paper: {
    marginBottom: 40
  },
  padding: {
    padding: '0 20px'
  },
  header: {
    margin: 10
  },
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1
  }
});

const AskForm = ({ username, isFollowed }) => {
  const classes = useStyles();
  const errorHandler = useContext(ErrorContext);
  const renderFollowButton = username !== localStorage.username;

  return (
    <Paper className={classes.paper} variant="outlined">
      <div className={classes.padding}>
        <Typography variant="h6" className={classes.header}>
          {`Ask ${username === localStorage.username ? 'yourself' : `@${username}`}`}
        </Typography>
        <Formik
          initialValues={{
            question: '',
            isAnonymous: true
          }}
          validationSchema={askFormValidationSchema}
          onSubmit={async (values, { resetForm }) => {
            try {
              await axiosInstance.post(`/${username}/ask`, { ...values });
              resetForm({
                values: {
                  question: '',
                  isAnonymous: values.isAnonymous
                }
              });
            } catch (e) {
              const error = e.response ? e.response.data.message : e.message;
              errorHandler(error);
            }
          }}
        >
          {({
            values, isValid, dirty, isSubmitting
          }) => (
            <Form>
              <Field
                as={TextField}
                rowsMax={6}
                multiline
                fullWidth
                variant="outlined"
                name="question"
              />
              <div className={classes.flex}>
                <InputLabel className={classes.grow} htmlFor="anonymous">
                  <Field
                    id="anonymous"
                    as={Switch}
                    type="checkbox"
                    color="primary"
                    name="isAnonymous"
                  />
                  Ask Anonymously
                </InputLabel>
                <Typography variant="caption">
                  {300 - values.question.length}
                </Typography>
                <Button
                  disabled={!(isValid && dirty) || isSubmitting}
                  type="submit"
                >
                  Ask
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        {renderFollowButton && (
          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Follow key={isFollowed} username={username} isFollowed={isFollowed} />
          </div>
        )}
      </div>
    </Paper>
  );
};

AskForm.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired
};

export default AskForm;
