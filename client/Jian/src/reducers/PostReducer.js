import {ACTIONS} from '../actions/post';
const R = require('ramda');

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
    let newState;
    switch (action.type) {
        case ACTIONS.FETCH_POSTS:
            newState = {
                ...state,
                query: action.payload.query,
            };
            if (!action.payload.query.last)
                newState.postList.rows = [];
            return newState;
        case ACTIONS.FETCH_POSTS_SUCCESS:
            let rows = action.payload;
            newState = {
                ...state,
                postList: {
                    ...initial_state.postList,
                    rows: R.concat(state.postList.rows)(rows),
                }
            };
            if (rows.length > 0) {
                let lastItem = rows[rows.length - 1];
                newState.query.last = lastItem._id;
            }
            console.log("=>", newState);
            return newState;
        case ACTIONS.FETCH_POSTS_FAILURE:
            return {
                ...state,
                postList: {
                    ...initial_state.postList,
                    error: 'Failed to fetch posts',
                }
            };
        default:
            return state;
    }
}