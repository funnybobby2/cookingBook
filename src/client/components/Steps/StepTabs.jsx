import React from 'react';
import PropTypes from 'prop-types';
// import react component
import { Player } from 'video-react';
// Import style
import './Steps.scss';
import './video.scss';

class StepTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openVideo: false
    };

    this.openVideo = this.openVideo.bind(this);
    this.closeVideo = this.closeVideo.bind(this);
  }

  openVideo() {
    if (this.props.video) { this.setState({ openVideo: true }); }
  }

  closeVideo() {
    this.setState({ openVideo: false });
  }

  render() {
    const classVideo = `stepsVideo ${this.props.video ? '' : 'disable'}`;
    const classPlayer = `player${this.state.openVideo ? ' open' : ''}`;
    let video = '';
    if (this.props.video) {
      let currentRecipeVideo;
      try {
        currentRecipeVideo = require(`../../assets/video/${this.props.recipeID}.mp4`);
      } catch (e) {
        currentRecipeVideo = require('../../assets/video/default.mp4');
      }
      video = (
        <div className={classPlayer}>
          <i className="material-icons closer" onClick={this.closeVideo}>close</i>
          <Player
            playsInline
            poster=""
            src={currentRecipeVideo}
          />
        </div>
      );
    }

    return (
      <div className="stepTabs">
        <div className={classVideo}>
          <i className="material-icons stepsVideoIcon" onClick={this.openVideo}>videocam</i>
        </div>
        {video}
      </div>);
  }
}

StepTabs.propTypes = {
  recipeID: PropTypes.number,
  video: PropTypes.bool
};

StepTabs.defaultProps = { // define the default props
  recipeID: 0,
  video: false
};

export default StepTabs;
