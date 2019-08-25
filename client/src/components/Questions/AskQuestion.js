import React from 'react';
import axios from 'axios';
import Follow from '../Follow/Follow';

class AskQuestion extends React.Component {
  state = {
    checked: true,
    question: '',
    error: ''
  };

  questionSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/${this.props.username}/ask`,
        {
          question: this.state.question,
          isAnonymous: this.state.checked
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      if (response.status === 201) {
        this.setState({
          question: '',
          error: ''
        });
      } else {
        throw new Error('Something went wrong');
      }
    } catch (e) {
      this.setState({
        error: e.response ? e.response.data.message : e.message
      });
    }
  }

  render() {
    return (
      <div>
        <form className="ui form">
          <div className="field">
            <textarea
              rows="4"
              className="item"
              name="question"
              value={this.state.question}
              onChange={e => this.setState({
                question: e.target.value
              })
              }
            />
          </div>

          <div>
            <div className="ui left floated">
              <label>
                <input
                  style={{ marginRight: '5px' }}
                  type="checkbox"
                  checked={this.state.checked}
                  onChange={e => this.setState({
                    checked: e.target.checked
                  })}
                  name="isAnonymous"
                />
              Ask Anonymously
              </label>
              <div style={{ float: 'right', marginRight: '10%' }}>
                {300 - this.state.question.length}
              </div>
            </div>
            <div
              style={{ marginTop: '-3.2%', marginBottom: '1%' }}
              className={`ui right floated button 
              ${this.state.question.length > 300 || this.state.question.length === 0
        ? 'disabled' : ''}`}
              onClick={this.questionSubmitHandler}
            >
               Ask
            </div>

            {this.props.renderButton && (
              <div>
                <Follow
                  key={this.props.isFollowed}
                  username={this.props.username}
                  isFollowed={this.props.isFollowed}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default AskQuestion;
