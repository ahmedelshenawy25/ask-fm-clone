import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';


const SearchBar = () => {
  const history = useHistory();

  return (
    <Formik
      initialValues={{ search: '' }}
      onSubmit={(values, { resetForm }) => {
        history.push(`/search?q=${values.search}`);
        resetForm();
      }}
    >
      <Form>
        <div style={{ margin: '0 50%' }} className="ui search">
          <div className="ui icon input">
            <Field className="prompt" name="search" placeholder="Search" />
            <i className="search icon" />
          </div>
        </div>
      </Form>
    </Formik>
  );
};

export default SearchBar;
