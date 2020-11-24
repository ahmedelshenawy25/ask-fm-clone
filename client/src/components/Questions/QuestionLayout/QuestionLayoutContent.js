import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import AnswerForm from '../../Answer/AnswerForm';

const useStyles = makeStyles({
  margin: {
    marginTop: 10
  },
  answer: {
    fontSize: 16,
    wordWrap: 'break-word',
    lineHeight: '21px'
  }
});

const QuestionLayoutContent = ({
  answer, id, removeQuestion, questionDeleteHandler, answerErrorHandler
}) => {
  const classes = useStyles();

  return (
    <div className={classes.margin}>
      {answer ? (
        <Typography className={classes.answer}>
          {answer}
        </Typography>
      ) : (
        <AnswerForm
          id={id}
          removeQuestion={removeQuestion}
          questionDeleteHandler={questionDeleteHandler}
          answerErrorHandler={answerErrorHandler}
        />
      )}
    </div>
  );
};

QuestionLayoutContent.propTypes = {
  answer: PropTypes.string,
  id: PropTypes.string,
  removeQuestion: PropTypes.func,
  questionDeleteHandler: PropTypes.func,
  answerErrorHandler: PropTypes.func
};

export default QuestionLayoutContent;
