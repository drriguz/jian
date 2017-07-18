import {ACTIONS} from '../actions/post';

const initial_state = {
    postList: {
        rows: [],
        error: null,
        loading: false
    }
};

export default PostReducer = (state = initial_state, action) => {
    let error;

    switch (action.type) {
        case ACTIONS.FETCH_POSTS:
            return {
                ...state,
                postList: {
                    rows: [],
                    error: null,
                    loading: true
                }
            };
        case ACTIONS.FETCH_POSTS_SUCCESS:
            console.log('success-->', action);
            return {
                ...state,
                postList: {
                    rows: action.payload,
                    error: null,
                    loading: false
                }
            };
        case ACTIONS.FETCH_POSTS_FAILURE:
            return {
                ...state,
                postList: {
                    rows: [],
                    error: 'Failed to fetch posts',
                    loading: false
                }
            };
        default:
            return state;
    }
}