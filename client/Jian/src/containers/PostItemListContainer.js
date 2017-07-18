import {connect} from 'react-redux';
import {fetchPosts, fetchPostsFailure, fetchPostsSuccess} from '../actions/post';
import PostItemList from '../components/PostItemList';

const mapStateToProps = (state) => {
    return {
        postList: state.posts.postList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchPosts: () => {
            dispatch(fetchPosts())
                .then((response) => {
                    console.log('res:', response);
                    if (response.error)
                        return dispatch(fetchPostsFailure(response.payload.data));
                    return dispatch(fetchPostsSuccess(response.payload.data.rows));
                })
                .catch(err => {
                    console.error(err);
                });
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(PostItemList);