import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import TextField from '@material-ui/core/TextField';
import { Paper } from '@material-ui/core';

const SearchBar = () => {
  const history = useHistory();

  return (
    <Paper>
      <Formik
        initialValues={{ search: '' }}
        onSubmit={(values, { resetForm }) => {
          history.push(`/search?q=${values.search}`);
          resetForm();
        }}
      >
        <Form>
          <Field
            name="search"
            placeholder="Search"
            as={TextField}
            variant="outlined"
            size="small"
          />
        </Form>
      </Formik>
    </Paper>
  );
};

export default SearchBar;
