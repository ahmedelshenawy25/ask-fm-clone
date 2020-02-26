import './DisplayAnsweredQuestions.css';
import React from 'react';
import axios from 'axios';
import QuestionItem from './QuestionItem';
import AskQuestion from './AskQuestion';
import RightSideBox from '../RightSideBox/RightSideBox';

class DisplayAnsweredQuestions extends React.Component {
  state = {
    questions: [],
    isFollowed: true,
    renderButton: false,
    error: ''
  };

  async componentDidMount() {
    try {
      const response = await axios.get(`/api/user/${this.props.match.params.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 200) {
        this.setState({
          questions: response.data.modifiedQuestions,
          isFollowed: response.data.isFollowed,
          renderButton: response.data.renderFollowButton,
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

  render() {
    const renderedQuestions = this.state.questions.map(({
      _id, question, answer, sender, updatedAt
    }) => (
      <QuestionItem
        key={_id}
        question={question}
        answer={answer}
        sender={sender}
        time={new Date(updatedAt).toLocaleString()}
        isAnswered
      />
    ));
    return (
      <div className="FlexParent">
        <div className="leftFlexChild">
          <AskQuestion
            username={this.props.match.params.username}
            isFollowed={this.state.isFollowed}
            renderButton={this.state.renderButton}
          />
          {renderedQuestions}
        </div>
        <RightSideBox />
      </div>
    );
  }
}

export default DisplayAnsweredQuestions;
