import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import PropTypes from 'prop-types';
import axiosInstance from '../../axiosInstance/axiosInstance';
import Follow from '../Follow/Follow';
import askFormValidationSchema from './askForm.validationSchema';

const AskForm = ({ username, isFollowed, renderButton }) => {
  const [error, setError] = useState('');

  return (
    <>
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
            setError(e.response ? e.response.data.message : e.message);
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
                rows="4"
                className="item"
                name="question"
              />
            </div>

            <div className="ui left floated">
              <label htmlFor="anonymous">
                <Field
                  id="anonymous"
                  style={{ marginRight: '5px' }}
                  type="checkbox"
                  name="isAnonymous"
                />
                Ask Anonymously
              </label>

              <div style={{ float: 'right', marginRight: '10%' }}>
                {300 - values.question.length}
              </div>
            </div>

            <button
              style={{ marginTop: '-3.2%', marginBottom: '1%' }}
              className="ui right floated button"
              disabled={!(isValid && dirty) || isSubmitting}
              type="submit"
            >
              Ask
            </button>
          </Form>
        )}
      </Formik>
      {renderButton && <Follow key={isFollowed} username={username} isFollowed={isFollowed} />}
    </>
  );
};

AskForm.propTypes = {
  username: PropTypes.string.isRequired,
  isFollowed: PropTypes.bool.isRequired,
  renderButton: PropTypes.bool.isRequired
};

export default AskForm;
