import React, { useState, useEffect } from "react";
import { ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { db } from "../../config/index";
import PropTypes from "prop-types";
import firebase from "../../config/index";

const TutorialLikesDislikes = ({ tutorial_id }) => {
  const [userChoice, setUserChoice] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const [dislikesCount, setDislikesCount] = useState(0);

  const tutorialLikesDocRef = db.collection("tutorial_likes").doc(tutorial_id); // Reference to the document in the "tutorial_likes" collection

  const tutorialLikesDocSnapshot = tutorialLikesDocRef.get();
  const tutorialDislikesDocRef = db
    .collection("tutorial_dislikes")
    .doc(tutorial_id); // Reference to the document in the "tutorial_dislikes" collection
  const tutorialDislikesDocSnapshot = tutorialDislikesDocRef.get();

  useEffect(() => {
    const fetchData = async () => {
      if (!firebase.auth().currentUser) {
        // User not authenticated
        return;
      }

      // Check if the current user has already liked the tutorial
      const likesSnapshot = await tutorialLikesDocRef.get();
      if (likesSnapshot.exists) {
        const userIds = likesSnapshot.data().userIds || [];
        if (userIds.includes(firebase.auth().currentUser.uid)) {
          setUserChoice("like");
        }
      }

      // Check if the current user has already disliked the tutorial
      const dislikesSnapshot = await tutorialDislikesDocRef.get();
      if (dislikesSnapshot.exists) {
        const userIds = dislikesSnapshot.data().userIds || [];
        if (userIds.includes(firebase.auth().currentUser.uid)) {
          setUserChoice("dislike");
        }
      }

      // Subscribe to like/dislike counts in Firestore
      const unsubscribeLikes = db
        .collection("tutorial_likes")
        .doc(tutorial_id)
        .onSnapshot(doc => {
          if (doc.exists) {
            setLikesCount(doc.data().userIds.length || 0);
          }
        });

      const unsubscribeDislikes = db
        .collection("tutorial_dislikes")
        .doc(tutorial_id)
        .onSnapshot(doc => {
          if (doc.exists) {
            setDislikesCount(doc.data().userIds.length || 0);
          }
        });

      // Unsubscribe from snapshot listeners when component unmounts
      return () => {
        unsubscribeLikes();
        unsubscribeDislikes();
      };
    };

    fetchData();
  }, [tutorial_id]);

  async function handleIncrement(newChoice) {
    const fieldToUpdate =
      newChoice === "like" ? "tutorial_likes" : "tutorial_dislikes";
    const countField = newChoice === "like" ? "likes" : "dislikes";
    const addUserId = firebase.firestore.FieldValue.arrayUnion(
      firebase.auth().currentUser.uid
    );

    // Update like/dislike count of tutorials in Firestore
    await db
      .collection("tutorials")
      .doc(tutorial_id)
      .update({
        [countField]: firebase.firestore.FieldValue.increment(1)
      });

    // Update like/dislike count in Firestore
    await db
      .collection(fieldToUpdate)
      .doc(tutorial_id)
      .update({
        [fieldToUpdate + "_count"]: firebase.firestore.FieldValue.increment(1),
        userIds: addUserId
      });

    setUserChoice(newChoice);
    if (newChoice === "like") {
      setLikesCount(likesCount + 1);
    } else {
      setDislikesCount(dislikesCount + 1);
    }

    // Log the updated array of users
    const docSnapshot = await db
      .collection(fieldToUpdate)
      .doc(tutorial_id)
      .get();
    console.log(
      `array of users who are in ${fieldToUpdate}`,
      docSnapshot.data().userIds
    );
  }

  const handleUserChoice = async (event, newChoice) => {
    if (!tutorialLikesDocSnapshot.exists) {
      // Document doesn't exist, create it with initial data
      await tutorialLikesDocRef.set({
        tutorial_id: tutorial_id,
        userIds: [],
        tutorial_likes_count: 0
      });
    }

    if (!tutorialDislikesDocSnapshot.exists) {
      // Document doesn't exist, create it with initial data
      await tutorialDislikesDocRef.set({
        tutorial_id: tutorial_id,
        userIds: [],
        tutorial_dislikes_count: 0
      });
    }

    if (newChoice) {
      handleIncrement(newChoice);
    }
    if (userChoice) {
      //   Update like/dislike count of tutorials in Firestore
      await db
        .collection("tutorials")
        .doc(tutorial_id)
        .update({
          [userChoice + "s"]: firebase.firestore.FieldValue.increment(-1)
        });
    }
    setUserChoice(newChoice);
  };

  return (
    <ToggleButtonGroup
      size="small"
      value={userChoice}
      exclusive
      onChange={handleUserChoice}
      aria-label="like dislike"
    >
      <ToggleButton value="like" aria-label="like">
        <ThumbUp />
        <Typography variant="body2">{likesCount}</Typography>
      </ToggleButton>
      <ToggleButton value="dislike" aria-label="dislike">
        <ThumbDown />
        <Typography variant="body2">{dislikesCount}</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

TutorialLikesDislikes.propTypes = {
  tutorial_id: PropTypes.string.isRequired
};

export default TutorialLikesDislikes;