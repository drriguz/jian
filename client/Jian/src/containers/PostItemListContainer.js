import {connect} from 'react-redux';
import {
    fetchPostsActionCreator,
    fetchPostsFailureActionCreator,
    fetchPostsSuccessActionCreator,
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
    let fetchAction = dispatch(fetchPostsActionCreator(search, last));
    fetchAction.payload.request.then((response) => {
        if (response.error)
            return dispatch(fetchPostsFailureActionCreator(response.data));
        return dispatch(fetchPostsSuccessActionCreator(response.data));
    }).catch(err => {
        console.log(err);
        return dispatch(fetchPostsFailureActionCreator(err));
    });
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: (search, last) => doFetchPost(dispatch, search, last)
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItemList);