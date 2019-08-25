import './Home.css';
import React from 'react';
import axios from 'axios';
import QuestionItem from '../Questions/QuestionItem';
import SearchItem from '../Search/SearchItem';
import RightSideBox from '../RightSideBox.js/RightSideBox';

class Home extends React.Component {
    state = {
      questions: [],
      error: ''
    };

    async componentDidMount() {
      try {
        // Couldn't use this.props.token because it's empty when componentDidMount is called
        if (localStorage.getItem('token')) {
          const response = await axios.get('/api/home', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.status === 200) {
            if (Array.isArray(response.data)) {
              this.setState({
                questions: response.data,
                error: ''
              });
            }
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
      const renderedUsers = this.state.questions.map(({
        _id, recipient
      }) => (
        <SearchItem
          key={`${_id}${recipient.username}`}
          username={recipient.username}
          fullName={`${recipient.firstName} ${recipient.lastName}`}
          renderButtons={false}
          isFollowed
        />
      ));
      const renderedUsersWithQuestions = renderedUsers.map((user, i) => (
        <div key={i} className="ui card Home">
          {user}
          {renderedQuestions[i]}
        </div>
      ));
      return (
        <div className="FlexParent">
          <div className="ui relaxed divided list questionBox leftFlexChild">
            {renderedUsersWithQuestions}
          </div>
          {this.props.token && <RightSideBox />}
        </div>
      );
    }
}

export default Home;
