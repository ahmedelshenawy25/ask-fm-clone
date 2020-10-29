/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import answerFormValidationSchema from './answerForm.validationSchema';
import axiosInstance from '../../axiosInstance/axiosInstance';

const AnswerForm = ({
  id, removeQuestion, questionDeleteHandler, answerErrorHandler
}) => (
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
      <Form className="ui form">
        <div className="field">
          <Field
            as="textarea"
            rows="2"
            className="item"
            name="answer"
          />

          <button
            style={{ marginTop: '10px' }}
            className="ui right floated button"
            disabled={!(isValid && dirty) || isSubmitting}
            type="submit"
          >
            Answer
          </button>

          <div
            style={{
              paddingTop: '17px',
              paddingRight: '10px'
            }}
            className="ui right floated"
          >
            {3000 - values.answer.length}
          </div>

          <div
            style={{ marginTop: '10px' }}
            className="ui left floated button"
            onClick={questionDeleteHandler}
          >
            Delete
          </div>
        </div>
      </Form>
    )}
  </Formik>
);

AnswerForm.propTypes = {
  id: PropTypes.string.isRequired,
  removeQuestion: PropTypes.func.isRequired,
  questionDeleteHandler: PropTypes.func.isRequired,
  answerErrorHandler: PropTypes.func.isRequired
};

export default AnswerForm;
