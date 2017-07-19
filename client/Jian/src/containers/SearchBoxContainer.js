import {connect} from 'react-redux';
import SearchBox from '../components/SearchBox';
import {
    setFetchArgumentsActionCreator
} from '../actions/post';

const mapStateToProps = (state) => {
    return { query: state.posts.query };
};
import {doFetchPost} from './PostItemListContainer';

const mapDispatchToProps = (dispatch) => {
    return {
        onSearch: (keyword, limit) => {
            //dispatch(setFetchArgumentsActionCreator(keyword));
            doFetchPost(dispatch, keyword, null, limit);
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);