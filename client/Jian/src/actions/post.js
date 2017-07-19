import axios from 'axios';
import {API_FETCH_URL} from '../constants';

export const ACTIONS = {
    FETCH_POSTS: 'FETCH_POSTS',
    FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
    FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE',
    REFRESH_POSTS: 'REFRESH_POSTS',
    SET_FETCH_ARGS: 'SET_FETCH_ARGS',
};

export const fetchPostsActionCreator = (search, last) => {
    let url = API_FETCH_URL + "?rows=1";
    if (search)
        url += `&search=${search}`;
    if (last)
        url += `&last=${last}`;
    console.log("fetch url:", url);
    const request = axios({
        method: 'get',
        url: url,
        headers: []
    });

    return {
        type: ACTIONS.FETCH_POSTS,
        payload: request
    }
};

export const fetchPostsSuccessActionCreator = (posts) => {
    return {
        type: ACTIONS.FETCH_POSTS_SUCCESS,
        payload: posts
    }
};

export const fetchPostsFailureActionCreator = (error) => {
    return {
        type: ACTIONS.FETCH_POSTS_FAILURE,
        payload: error
    }
};

export const refreshPostsActionCreator = () => {
    return {
        type: ACTIONS.REFRESH_POSTS,
        payload: {}
    }
};

export const setFetchArgumentsActionCreator = (search, last) => {
    return {
        type: ACTIONS.SET_FETCH_ARGS,
        payload: {
            search: search,
            last: last
        }
    }
};