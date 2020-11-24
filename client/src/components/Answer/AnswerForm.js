import React from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import answerFormValidationSchema from './answerForm.validationSchema';
import axiosInstance from '../../axiosInstance/axiosInstance';

const useStyles = makeStyles({
  flex: {
    display: 'flex',
    alignItems: 'center'
  },
  grow: {
    flexGrow: 1
  }
});

const AnswerForm = ({
  id, removeQuestion, questionDeleteHandler, answerErrorHandler
}) => {
  const classes = useStyles();

  return (
    <Formik
      initialValues={{
        answer: ''
      }}
      validationSchema={answerFormValidationSchema}
      onSubmit={async (values) => {
        try {
          await axiosInstance.put(`/answer/${id}`, {
            ...values
          });
          removeQuestion(id);
        } catch (e) {
          answerErrorHandler(e);
        }
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
              <Button onClick={questionDeleteHandler}>
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
  removeQuestion: PropTypes.func.isRequired,
  questionDeleteHandler: PropTypes.func.isRequired,
  answerErrorHandler: PropTypes.func.isRequired
};

export default AnswerForm;
