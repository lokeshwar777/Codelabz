import * as actions from "../../actions/actionTypes";

const initialState = {
    upVotes: 0,
    downVotes: 0,
    userChoice: null,
    loading: false,
    error: null,
};

const TutorialsLikeReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actions.GET_TUTORIAL_LIKES_DATA_START:
        case actions.SET_TUTORIAL_USER_CHOICE_START:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case actions.GET_TUTORIAL_LIKES_DATA_SUCCESS:
            return {
                ...state,
                upVotes: payload.upVotes,
                downVotes: payload.downVotes,
                userChoice: payload.userChoice,
                loading: false,
                error: null,
            };

        case actions.SET_TUTORIAL_USER_CHOICE_SUCCESS:
            return {
                ...state,
                userChoice: payload.userChoice,
                loading: false,
                error: null,
            };

        case actions.GET_TUTORIAL_LIKES_DATA_FAIL:
        case actions.SET_TUTORIAL_USER_CHOICE_FAIL:
            return {
                ...state,
                loading: false,
                error: payload.error,
            };

        default:
            return state;
    }
};

export default TutorialsLikeReducer;
