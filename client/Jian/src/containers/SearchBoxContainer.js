import {connect} from 'react-redux';
import SearchBox from '../components/SearchBox';
import {
    setFetchArgumentsActionCreator
} from '../actions/post';

const mapStateToProps = (state) => {
    return {};
};
import {doFetchPost} from './PostItemListContainer';

const mapDispatchToProps = (dispatch) => {
    return {
        onSearch: (keyword) => {
            dispatch(setFetchArgumentsActionCreator(keyword));
            doFetchPost(dispatch, keyword);
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);