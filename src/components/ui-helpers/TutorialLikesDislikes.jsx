import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Box
} from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import {
  getCurrentTutorialLikesData,
  setTutorialUserChoice
} from "../../store/actions";

const TutorialLikesDislikes = ({
  tutorial_id,
  upVotes,
  downVotes,
  userChoice: initialUserChoice,
  getCurrentTutorialLikesData,
  setTutorialUserChoice
}) => {
  const [userChoice, setUserChoice] = useState(initialUserChoice);

  useEffect(() => {
    if (tutorial_id) {
      getCurrentTutorialLikesData({ tutorial_id });
    }
  }, [getCurrentTutorialLikesData, userChoice]);

  useEffect(() => {
    setUserChoice(initialUserChoice);
  }, [initialUserChoice]);

  const handleUserChoice = async (event, newChoice) => {
    if (newChoice === userChoice) return;

    try {
      await setTutorialUserChoice({ tutorial_id, newChoice });
      setUserChoice(newChoice);
    } catch (error) {
      console.error("Error setting user choice:", error);
    }
  };

  return (
    <Box display="flex" alignItems="center">
      <ToggleButtonGroup
        size="small"
        value={userChoice}
        exclusive
        onChange={handleUserChoice}
        aria-label="like dislike"
      >
        <ToggleButton value="like" aria-label="like">
          <ThumbUp />
          <Typography variant="body2" style={{ marginLeft: 4 }}>
            {upVotes}
          </Typography>
        </ToggleButton>
        <ToggleButton value="dislike" aria-label="dislike">
          <ThumbDown />
          <Typography variant="body2" style={{ marginLeft: 4 }}>
            {downVotes}
          </Typography>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

TutorialLikesDislikes.propTypes = {
  tutorial_id: PropTypes.string.isRequired,
  upVotes: PropTypes.number.isRequired,
  downVotes: PropTypes.number.isRequired,
  userChoice: PropTypes.string,
  getCurrentTutorialLikesData: PropTypes.func.isRequired,
  setTutorialUserChoice: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const tutorialState = state?.tutorials?.likes;
  // console.log("state?.tutorials?.likes", state?.tutorials?.likes);

  return {
    upVotes: tutorialState ? tutorialState.upVotes : 0,
    downVotes: tutorialState ? tutorialState.downVotes : 0,
    userChoice: tutorialState ? tutorialState.userChoice : null
  };
};

const mapDispatchToProps = {
  getCurrentTutorialLikesData,
  setTutorialUserChoice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TutorialLikesDislikes);
