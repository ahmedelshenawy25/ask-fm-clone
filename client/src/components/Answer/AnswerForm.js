import React from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import answerFormValidationSchema from './answerForm.validationSchema';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1
  }
});

const AnswerForm = ({ questionDeleteHandler, answerHandler, id }) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        answer: ''
      }}
      validationSchema={answerFormValidationSchema}
      onSubmit={async ({ answer }) => {
        await answerHandler(id, answer);
      }}
    >
      {({
        values, isValid, dirty, isSubmitting
      }) => (
        <Form>
          <Field
            as={TextField}
            rowsMax={7}
            multiline
            fullWidth
            variant="outlined"
            name="answer"
          />
          <div className={classes.flex}>
            <div className={classes.grow}>
              <Button onClick={() => questionDeleteHandler(id)}>
                Delete
              </Button>
            </div>
            <Typography variant="caption">
              {3000 - values.answer.length}
            </Typography>
            <Button
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
            >
              Answer
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

AnswerForm.propTypes = {
  id: PropTypes.string.isRequired,
  questionDeleteHandler: PropTypes.func.isRequired,
  answerHandler: PropTypes.func.isRequired
};

export default AnswerForm;
