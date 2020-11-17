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
        <div>
          <Field name="search" placeholder="Search" />
        </div>
      </Form>
    </Formik>
  );
};

export default SearchBar;
