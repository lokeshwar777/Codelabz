import * as actions from "../../actions/actionTypes";

const initialState = {
    upVotes: 0,
    downVotes: 0,
    userChoice: null,
    loading: false,
    error: null,
};

const CommentsLikeReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actions.GET_COMMENT_LIKES_DATA_START:
        case actions.SET_COMMENT_USER_CHOICE_START:
            return {
                ...state,
                comment_id: payload.comment_id,
                loading: true,
            };

        case actions.GET_COMMENT_LIKES_DATA_SUCCESS:
            return {
                ...state,
                comment_id: payload.comment_id,
                upVotes: payload.upVotes,
                downVotes: payload.downVotes,
                userChoice: payload.userChoice,
                loading: false,
            };

        case actions.SET_COMMENT_USER_CHOICE_SUCCESS:
            return {
                ...state,
                comment_id: payload.comment_id,
                userChoice: payload.userChoice,
                loading: false,
            };

        case actions.GET_COMMENT_LIKES_DATA_FAIL:
        case actions.SET_COMMENT_USER_CHOICE_FAIL:
            return {
                ...state,
                comment_id: payload.comment_id,
                loading: false,
                error: payload.error,
            };

        default:
            return state;
    }
};

export default CommentsLikeReducer;
