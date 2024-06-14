import { combineReducers } from "redux";
import PostReducer from "./postReducer";
import CommentReducer from "./commentReducer";
import FeedReducer from "./feedReducer";
import commentLikeReducer from "./commentLikeReducer";

export default combineReducers({
  post: PostReducer,
  comment: CommentReducer,
  feed: FeedReducer,
  likes: commentLikeReducer,
});
