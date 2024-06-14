import * as actions from "./actionTypes";

export const getTutorialFeedIdArray = uid => async (_, firestore) => {
  try {
    let followings = [];
    if (uid) {
      followings = await firestore
        .collection("user_followers")
        .where("followerId", "==", uid)
        .where("isPublished", "==", true)
        .get()
        .then(async docs => {
          const result = [];
          for (const doc of docs.docs) {
            const handle = await firestore
              .collection("cl_user")
              .doc(doc.data().followingId)
              .get()
              .then(doc => doc.data().handle);

            result.push(handle);
          }
          return result;
        });
    }
    let followingUsersTutorials = [];
    if (followings.length > 0) {
      followingUsersTutorials = await firestore
        .collection("tutorials")
        .where("created_by", "in", followings)
        .where("isPublished", "==", true)
        .limit(50)
        .get()
        .then(docs => {
          const tutorialsArray = [];
          docs.docs.map(doc => {
            const tutorialId = doc.id;
            tutorialsArray.push(tutorialId);
          });
          return tutorialsArray;
        });
    }
    let newTutorials = [];
    if (followings.length > 0) {
      newTutorials = await firestore
        .collection("tutorials")
        .where("created_by", "not-in", followings)
        .where("isPublished", "==", true)
        .limit(50)
        .get()
        .then(docs => {
          const tutorialsArray = [];
          docs.docs.map(doc => {
            const tutorialId = doc.id;
            tutorialsArray.push(tutorialId);
          });
          return tutorialsArray;
        });
    } else {
      newTutorials = await firestore
        .collection("tutorials")
        .where("isPublished", "==", true)
        .limit(50)
        .get()
        .then(docs => {
          const tutorialsArray = [];
          docs.docs.map(doc => {
            const tutorialId = doc.id;
            tutorialsArray.push(tutorialId);
          });
          return tutorialsArray;
        });
    }

    const tutorials = followingUsersTutorials.concat(newTutorials);

    return tutorials;
  } catch (e) {
    console.log(e);
  }
};

export const getTutorialFeedData =
  tutorialIdArray => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_TUTORIAL_FEED_START });
      const tutorials = await firestore
        .collection("tutorials")
        .where("tutorial_id", "in", tutorialIdArray)
        .get();
      if (tutorials.empty) {
        dispatch({ type: actions.GET_TUTORIAL_FEED_SUCCESS, payload: [] });
      } else {
        const feed = tutorials.docs.map(doc => {
          const tutorial = doc.data();
          const tutorialData = {
            tutorial_id: tutorial?.tutorial_id,
            title: tutorial?.title,
            summary: tutorial?.summary,
            owner: tutorial?.owner,
            created_by: tutorial?.created_by,
            createdAt: tutorial?.createdAt,
            featured_image: tutorial?.featured_image
          };
          return tutorialData;
        });
        dispatch({ type: actions.GET_TUTORIAL_FEED_SUCCESS, payload: feed });
      }
    } catch (e) {
      dispatch({ type: actions.GET_TUTORIAL_FEED_FAILED, payload: e });
    }
  };

export const getTutorialData =
  tutorialID => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_POST_DATA_START });
      const data = await firestore
        .collection("tutorials")
        .doc(tutorialID)
        .get();
      const tutorial = data.data();
      dispatch({ type: actions.GET_POST_DATA_SUCCESS, payload: tutorial });
    } catch (e) {
      dispatch({ type: actions.GET_POST_DATA_FAIL });
      console.log(e);
    }
  };

export const getTutorialSteps =
  tutorialID => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_STEPS_DATA_START });
      const data = await firestore
        .collection("tutorials")
        .doc(tutorialID)
        .collection("steps")
        .get()
        .then(querySnapshot => {
          let steps = [];
          querySnapshot.forEach(doc => {
            steps.push(doc.data());
          });
          return steps;
        });
      dispatch({ type: actions.GET_STEPS_DATA_SUCCESS, payload: data });
    } catch (e) {
      dispatch({ type: actions.GET_STEPS_DATA_FAIL, payload: e });
      console.log(e);
    }
  };

export const getCommentData =
  commentId => async (firebase, firestore, dispatch) => {
    try {
      dispatch({ type: actions.GET_COMMENT_DATA_START });
      const data = await firestore
        .collection("cl_comments")
        .doc(commentId)
        .get();
      const comment = data.data();
      dispatch({ type: actions.GET_COMMENT_DATA_SUCCESS, payload: comment });
    } catch (e) {
      dispatch({ type: actions.GET_COMMENT_DATA_FAIL });
      console.log(e);
    }
  };

export const getCommentReply =
  commentId => async (firebase, firestore, dispatch) => {
    try {
      console.log("commentId", commentId);
      dispatch({ type: actions.GET_REPLIES_START });
      console.log("Get replies");
      const replies = await firestore
        .collection("cl_comments")
        .where("replyTo", "==", commentId)
        .get()
        .then(querySnapshot => {
          let data = [];
          querySnapshot.forEach(doc => {
            data.push(doc.data().comment_id);
          });
          return data;
        });
      dispatch({
        type: actions.GET_REPLIES_SUCCESS,
        payload: { replies, comment_id: commentId }
      });
    } catch (e) {
      console.log(e);
    }
  };

export const addComment = comment => async (firebase, firestore, dispatch) => {
  try {
    dispatch({ type: actions.ADD_COMMENT_START });
    await firestore
      .collection("cl_comments")
      .add(comment)
      .then(docref => {
        firestore.collection("cl_comments").doc(docref.id).update({
          comment_id: docref.id
        });
        if (comment.replyTo == comment.tutorial_id) {
          firestore
            .collection("tutorials")
            .doc(comment.tutorial_id)
            .update({
              comments: firebase.firestore.FieldValue.arrayUnion(docref.id)
            });
        }
      })
      .then(() => {
        dispatch({ type: actions.ADD_COMMENT_SUCCESS });
      });
  } catch (e) {
    dispatch({ type: actions.ADD_COMMENT_FAILED, payload: e.message });
  }
};

export const getCurrentCommentLikesData = ({ comment_id }) =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const firebase = getFirebase();
      const firestore = getFirestore();

      dispatch({
        type: actions.GET_COMMENT_LIKES_DATA_START,
        payload: { comment_id }
      });

      const commentRef = firestore.collection("cl_comments").doc(comment_id);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        throw new Error('Comment not found');
      }

      const [upVotesSnapshot, downVotesSnapshot] = await Promise.all([
        firestore.collection('comment_likes')
          .where('comment_id', '==', comment_id)
          .where('value', '==', 1)
          .get(),
        firestore.collection('comment_likes')
          .where('comment_id', '==', comment_id)
          .where('value', '==', -1)
          .get()
      ]);

      const upVotes = upVotesSnapshot.size;
      const downVotes = downVotesSnapshot.size;

      await commentRef.update({ upVotes, downVotes });

      const userId = firebase.auth().currentUser.uid;
      const userChoiceDoc = await firestore
        .collection('comment_likes')
        .doc(`${comment_id}_${userId}`)
        .get();
      const userChoice = userChoiceDoc.exists
        ? (userChoiceDoc.data().value === 1 ? 'like' : 'dislike')
        : null;

      dispatch({
        type: actions.GET_COMMENT_LIKES_DATA_SUCCESS,
        payload: { comment_id, upVotes, downVotes, userChoice }
      });
    } catch (error) {
      dispatch({
        type: actions.GET_COMMENT_LIKES_DATA_FAIL,
        payload: { comment_id, error: error.message }
      });
    }
  };

export const setCommentUserChoice = ({ comment_id, newChoice }) =>
  async (dispatch, getState, { getFirebase, getFirestore }) => {
    try {
      const firebase = getFirebase();
      const firestore = getFirestore();

      dispatch({
        type: actions.SET_COMMENT_USER_CHOICE_START,
        payload: { comment_id }
      });

      const userId = firebase.auth().currentUser.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const commentRef = firestore.collection("cl_comments").doc(comment_id);
      const userChoiceRef = firestore
        .collection('comment_likes')
        .doc(`${comment_id}_${userId}`);
      const commentDoc = await commentRef.get();

      if (!commentDoc.exists) {
        throw new Error('Comment not found');
      }

      const batch = firestore.batch();

      if (newChoice) {
        const value = newChoice === "like" ? 1 : -1;
        batch.set(userChoiceRef, { uid: userId, comment_id, value }, { merge: true });
      } else {
        batch.delete(userChoiceRef);
      }

      await batch.commit();

      dispatch({
        type: actions.SET_COMMENT_USER_CHOICE_SUCCESS,
        payload: { comment_id, userChoice: newChoice }
      });
    } catch (error) {
      dispatch({
        type: actions.SET_COMMENT_USER_CHOICE_FAIL,
        payload: { comment_id, error: error.message }
      });
    }
  };
