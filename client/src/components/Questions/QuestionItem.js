/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import axios from 'axios';
import QuestionLayout from './QuestionLayout';

class QuestionItem extends React.Component {
  state = {
    answer: '',
    error: ''
  }

  answerSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put(`/api/answer/${this.props.id}`,
        { answer: this.state.answer },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      if (response.status === 204) {
        this.props.removeQuestion(this.props.id);
      } else {
        throw new Error('Something went wrong');
      }
    } catch (e) {
      this.setState({
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  questionDeleteHandler = async () => {
    this.props.removeQuestion(this.props.id);
    try {
      const response = await axios.delete(`/api/delete/${this.props.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status !== 204 && response.status !== 400) {
        throw new Error('Something went wrong');
      }
    } catch (e) {
      this.setState({
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    const {
      question, answer, sender, time, isAnswered
    } = this.props;
    let displayAnswerOrForm;
    if (isAnswered) {
      displayAnswerOrForm = <p style={{ fontSize: '1.2rem', lineHeight: '1.5rem' }}>{answer}</p>;
    } else {
      displayAnswerOrForm = (
        <form className="ui form">
          <div className="field">
            <textarea
              rows="2"
              className="item"
              name="answer"
              value={this.state.answer}
              onChange={e => this.setState({
                answer: e.target.value
              })
              }
            />
            <div
              style={{ marginTop: '10px' }}
              className={`ui right floated button ${this.state.answer.length > 3000 || this.state.answer.length === 0
                ? 'disabled' : ''}`}
              onClick={this.answerSubmitHandler}
            >
              Answer
            </div>
            <div style={{ paddingTop: '17px', paddingRight: '10px' }} className="ui right floated">
              {3000 - this.state.answer.length}
            </div>
            <div
              style={{ marginTop: '10px' }}
              className="ui left floated button"
              onClick={this.questionDeleteHandler}
            >
              Delete
            </div>
          </div>
        </form>
      );
    }
    return (
      <div className="ui divided items">
        <div style={{ minWidth: '100%' }} className="ui card QuestionItem">
          <div className="content">
            <QuestionLayout question={question} time={time} sender={sender} />
            <div style={{ padding: '0' }} className="ui vertical segment" />
            <div className="description">
              {displayAnswerOrForm}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default QuestionItem;
