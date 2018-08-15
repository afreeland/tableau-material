
// Closure #DecentPerson
(function(){

    const _key = 'select_opts';
    let configOpts = {};

$(document).ready( () => {
    $('#close-dialog').click(closeDialog)


    tableau.extensions.initializeDialogAsync().then(function () {
        // The openPayload sent from the parent extension in this example is the
        // default time interval for the refreshes.  This could alternatively be stored
        // in settings, but is used in this sample to demonstrate open and close payloads.
        // code goes here
        let currentSettings = tableau.extensions.settings.getAll();
        configOpts = JSON.parse(currentSettings[_key]);
        $('#formSelect #select_label').val(configOpts.label);
        $('#formSelect #select_placeholder').val(configOpts.placeholder);

        // To get filter info, first get the dashboard.
        const dashboard = tableau.extensions.dashboardContent.dashboard;
        let filterArr = [];
        // Then loop through each worksheet and get its filters, save promise for later.
        dashboard.worksheets.forEach(function (worksheet) {
            filterArr.push(worksheet.getFiltersAsync());
        });
        
        console.log('iterated through worksheets')
        Promise.all(filterArr)
            .then( (filtersForWorksheet) => {
                // Dont do anything with empty filters
                if (filtersForWorksheet.length === 0)
                    return console.log('no filters in any workbooks');

                console.log(filtersForWorksheet)
                filtersForWorksheet.forEach( (f, idx) => {
                    console.log(f);
                    // configOpts.filters.push(f)
                })

                configOpts.filter = {
                    name: 'Filter 1',
                    values: [{name: 'blue', value: 'bl'}, {name: 'red', value: 'r'}]
                };
            })
    });

    $('#formSelect').on('submit', () => {
        configOpts.label = configureForm.selectLabel.value;
        configOpts.placeholder = configureForm.selectPlaceholder.value;
        console.log('saving');
        console.log(configOpts);
        closeDialog();

        return false;
    })

    function closeDialog() {
        let currentSettings = tableau.extensions.settings.getAll();
        tableau.extensions.settings.set(_key, JSON.stringify(configOpts));
    
        tableau.extensions.settings.saveAsync().then((newSavedSettings) => {
            tableau.extensions.ui.closeDialog();
        });
    }
})

})()