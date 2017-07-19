import {connect} from 'react-redux';
import {
    fetchPostsActionCreator,
    fetchPostsFailureActionCreator,
    fetchPostsSuccessActionCreator,
    refreshPostsActionCreator
} from '../actions/post';
import PostItemList from '../components/PostItemList';

const mapStateToProps = (state) => {
    return {
        refreshing: state.posts.refreshing,
        postList: state.posts.postList,
        query: state.posts.query,
    };
};
export const doFetchPost = (dispatch, search, last) => {
    console.log("->fetching...");
    dispatch(fetchPostsActionCreator(search, last))
        .then((response) => {
            console.log('res:', response);
            if (response.error)
                return dispatch(fetchPostsFailureActionCreator(response.payload.data));
            return dispatch(fetchPostsSuccessActionCreator(response.payload.data));
        })
        .catch(err => {
            console.error(err);
        });
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: (search, last) => doFetchPost(dispatch, search, last),
        refreshPosts: () => {
            dispatch(refreshPostsActionCreator());
            doFetchPost(dispatch);
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItemList);