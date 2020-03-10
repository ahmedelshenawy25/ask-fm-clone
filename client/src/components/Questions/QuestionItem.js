/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';

import axiosInstance from '../../axiosInstance/axiosInstance';
import QuestionLayout from './QuestionLayout';


const QuestionItem = ({
  id, removeQuestion, question, answer: userAnswer, sender, time, isAnswered
}) => {
  const [error, setError] = useState('');

  const questionDeleteHandler = async () => {
    removeQuestion(id);
    try {
      await axiosInstance.delete(`/delete/${id}`);
    } catch (e) {
      setError(e.response ? e.response.data.message : e.message);
    }
  };

  let displayAnswerOrForm;
  if (isAnswered) {
    displayAnswerOrForm = <p style={{ fontSize: '1.2rem', lineHeight: '1.5rem' }}>{userAnswer}</p>;
  } else {
    displayAnswerOrForm = (
      <Formik
        initialValues={{ answer: '' }}
        onSubmit={async (values) => {
          try {
            await axiosInstance.put(`/answer/${id}`, { ...values });
            removeQuestion(id);
          } catch (e) {
            setError(e.response ? e.response.data.message : e.message);
          }
        }}
      >
        {({ values }) => (
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
                className={`ui right floated button ${values.answer.length > 3000 || values.answer.length === 0
                  ? 'disabled' : ''}`}
                type="submit"
              >
                Answer
              </button>
              <div style={{ paddingTop: '17px', paddingRight: '10px' }} className="ui right floated">
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
  }
  return (
    <div className="ui divided items">
      <div style={{ minWidth: '100%' }} className="ui card QuestionItem">
        <div className="content">
          <QuestionLayout question={question} time={time} sender={sender} />
          <div style={{ padding: '0' }} className="ui vertical segment" />
          <div className="description">
            {displayAnswerOrForm}
          </div>
        </div>
      </div>
    </div>
  );
};

QuestionItem.propTypes = {
  id: PropTypes.string,
  removeQuestion: PropTypes.func,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  sender: PropTypes.object,
  time: PropTypes.string.isRequired,
  isAnswered: PropTypes.bool.isRequired
};

export default QuestionItem;
