import React from 'react';
import axios from 'axios';
import QuestionItem from './QuestionItem';
import AskQuestion from './AskQuestion';
import Friends from '../Friends/Friends';
import Discover from '../Discover/Discover';

class DisplayAnsweredQuestions extends React.Component {
  state = {
    questions: [],
    isFollowed: true,
    renderButton: false,
    error: ''
  };

  async componentDidMount() {
    try {
      // Couldn't use this.props.token because it's empty when componentDidMount is called
      if (localStorage.getItem('token')) {
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
      }
    } catch (e) {
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
        <div
          className="rightFlexChild"
          style={{
            display: 'flex', flexGrow: 0.3, marginLeft: '1%', flexDirection: 'column'
          }}
        >
          <div className="sideBox">
          Friends
            <Friends />
          </div>
          <br />
          <div className="sideBox">
          Discover
            <Discover />
          </div>
        </div>
      </div>
    );
  }
}

export default DisplayAnsweredQuestions;
