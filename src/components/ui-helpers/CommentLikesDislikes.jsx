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
  getCurrentCommentLikesData,
  setCommentUserChoice
} from "../../store/actions";

const CommentLikesDislikes = ({
  comment_id,
  upVotes,
  downVotes,
  userChoice: initialUserChoice,
  getCurrentCommentLikesData,
  setCommentUserChoice
}) => {
  const [userChoice, setUserChoice] = useState(initialUserChoice);

  useEffect(() => {
    if (comment_id) {
      getCurrentCommentLikesData({ comment_id });
    }
  }, [userChoice, getCurrentCommentLikesData]);

  useEffect(() => {
    setUserChoice(initialUserChoice);
  }, [initialUserChoice]);

  const handleUserChoice = async (event, newChoice) => {
    if (newChoice === userChoice) return;

    try {
      await setCommentUserChoice({ comment_id, newChoice });
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

CommentLikesDislikes.propTypes = {
  comment_id: PropTypes.string.isRequired,
  upVotes: PropTypes.number.isRequired,
  downVotes: PropTypes.number.isRequired,
  userChoice: PropTypes.string,
  getCurrentCommentLikesData: PropTypes.func.isRequired,
  setCommentUserChoice: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  const commentState = state?.tutorialPage?.likes;
  // console.log("state?.tutorialPage?.likes", state?.tutorialPage?.likes);

  return {
    upVotes: commentState?.upVotes || 0,
    downVotes: commentState?.downVotes || 0,
    userChoice: commentState?.userChoice || null
  };
};

const mapDispatchToProps = {
  getCurrentCommentLikesData,
  setCommentUserChoice
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommentLikesDislikes);
