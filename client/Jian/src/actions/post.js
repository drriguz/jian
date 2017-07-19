import axios from 'axios';
import {API_FETCH_URL} from '../constants';

export const ACTIONS = {
    FETCH_POSTS: 'FETCH_POSTS',
    FETCH_POSTS_SUCCESS: 'FETCH_POSTS_SUCCESS',
    FETCH_POSTS_FAILURE: 'FETCH_POSTS_FAILURE',
};

export const fetchPostsActionCreator = (search, last, limit) => {
    let pageSize = limit || 5;
    let url = API_FETCH_URL + `?rows=${pageSize}`;
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
        payload: {
            request: request,
            query: {
                search: search,
                last: last,
                pageSize: limit,
            }
        }
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
