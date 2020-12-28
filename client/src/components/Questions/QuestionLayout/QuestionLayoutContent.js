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
  answer, questionDeleteHandler, answerHandler, id
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
          answerHandler={answerHandler}
          questionDeleteHandler={questionDeleteHandler}
        />
      )}
    </div>
  );
};

QuestionLayoutContent.propTypes = {
  id: PropTypes.string,
  answer: PropTypes.string,
  questionDeleteHandler: PropTypes.func,
  answerHandler: PropTypes.func
};

export default QuestionLayoutContent;
