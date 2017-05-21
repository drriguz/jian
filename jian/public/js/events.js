function searchGrid(searchForm, grid) {
    console.log('searching...');
    const searchFormData = $(searchForm).serializeJson();
    console.log(searchFormData);
    $(grid).jqGrid('setGridParam', {
        postData: searchFormData,
        page: 1
    }).trigger("reloadGrid");
}

function bindDefaultEvents(){
    $('.search-button').click(function(){
        searchGrid('form.search-form', '#jqGrid');
    });
}

$(function(){
    bindDefaultEvents();
});