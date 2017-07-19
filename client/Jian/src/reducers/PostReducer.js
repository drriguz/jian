import {ACTIONS} from '../actions/post';

const initial_state = {
    query: {
        search: "",
        last: null,
        pageSize: 1,
    },
    postList: {
        rows: [],
        error: null,
        loading: false,
    }
};

export default PostReducer = (state = initial_state, action) => {
    switch (action.type) {
        case ACTIONS.FETCH_POSTS:
            return {
                ...state,
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
        case ACTIONS.REFRESH_POSTS:
            return {
                ...state,
                ...initial_state,
            };
        case ACTIONS.SET_FETCH_ARGS:
            let newState = {
                ...state,
                query: {
                    last: action.payload.last || state.query.last,
                    search: action.payload.search || state.query.search,
                    pageSize: state.query.pageSize,
                }
            };
            console.log("new state", state, newState);
            return newState;
        default:
            return state;
    }
}