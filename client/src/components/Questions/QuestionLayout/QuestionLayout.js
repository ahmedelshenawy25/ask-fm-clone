import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import QuestionLayoutHeader from './QuestionLayoutHeader';
import QuestionLayoutMeta from './QuestionLayoutMeta';
import QuestionLayoutContent from './QuestionLayoutContent';

const useStyles = makeStyles({
  paper: {
    marginBottom: 15
  },
  padding: {
    padding: '15px 20px'
  }
});

const QuestionLayout = ({
  question, time, sender, recipient, answer, questionDeleteHandler, answerHandler, id
}) => {
  const classes = useStyles();

  return (
    <Paper className={classes.paper} variant="outlined">
      <div className={classes.padding}>
        <QuestionLayoutHeader question={question} sender={sender} />
        <QuestionLayoutMeta recipient={recipient} time={time} />
        <QuestionLayoutContent
          id={id}
          answer={answer}
          answerHandler={answerHandler}
          questionDeleteHandler={questionDeleteHandler}
        />
      </div>
    </Paper>
  );
};

QuestionLayout.propTypes = {
  id: PropTypes.string,
  question: PropTypes.string.isRequired,
  answer: PropTypes.string,
  time: PropTypes.string.isRequired,
  sender: PropTypes.object,
  recipient: PropTypes.object,
  questionDeleteHandler: PropTypes.func,
  answerHandler: PropTypes.func
};

export default QuestionLayout;
