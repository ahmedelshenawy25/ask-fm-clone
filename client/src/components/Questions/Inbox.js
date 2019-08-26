import React from 'react';
import axios from 'axios';
import QuestionItem from './QuestionItem';
import RightSideBox from '../RightSideBox.js/RightSideBox';

class Inbox extends React.Component {
  state = {
    questions: [],
    error: ''
  };

  async componentDidMount() {
    try {
      const response = await axios.get('/api/account/inbox', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        this.setState({
          questions: response.data,
          error: ''
        });
      } else {
        throw new Error('Could not retrieve questions');
      }
    } catch (e) {
      if (e.response.status === 401) {
        this.props.logout();
      }
      this.setState({
        questions: [],
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  removeQuestion = (id) => {
    const questions = this.state.questions.filter(question => question._id !== id);
    this.setState({ questions });
  }

  render() {
    const renderedQuestions = this.state.questions.map(({
      _id, question, answer, sender, createdAt
    }) => (
      <QuestionItem
        key={_id}
        id={_id}
        question={question}
        answer={answer}
        sender={sender}
        time={new Date(createdAt).toLocaleString()}
        isAnswered={false}
        removeQuestion={this.removeQuestion}
      />
    ));
    return (
      <div className="FlexParent">
        <div className="leftFlexChild">
          {renderedQuestions}
        </div>
        <RightSideBox />
      </div>
    );
  }
}

export default Inbox;
