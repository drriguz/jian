import axios from 'axios';

export const ACTIONS = {
    FETCH_POSTS: 'FETCH_POSTS',
    FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
    FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE'
};

export const fetchPosts = () => {
    const request = axios({
        method: 'get',
        url: 'http://127.0.0.1:8080/posts.json',
        headers: []
    });

    return {
        type: ACTIONS.FETCH_POSTS,
        payload: request
    }
}

export const fetchPostsSuccess = (posts) => {
    return {
        type: ACTIONS.FETCH_POSTS_SUCCESS,
        payload: posts
    }
}

export const fetchPostsFailure = (error) => {
    return {
        type: ACTIONS.FETCH_POSTS_FAILURE,
        payload: error
    }
}