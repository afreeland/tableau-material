
// Closure #DecentPerson
(function(){

    const _key = 'select_opts';
    let configOpts = {};

$(document).ready( () => {
    let dashboard;
    let worksheets;
    
    var app = new Vue({
        el: '#app',
        data: {
            label: 'My Label',
            placeholder: 'Choose an option',
            
            sheets: [], // All worksheets (builds out select dropdown)
            selectedSheet: "", // Store the sheet the user selected

            filters: [], // All filters for the selected worksheet
            selectedFilter: "", // Store the filter the user wants to use Materialize select on

            values: [], // The actual values that will appear in the end product

        },
        created: function(){
            tableau.extensions.initializeDialogAsync().then(() => {
                dashboard = tableau.extensions.dashboardContent.dashboard;
                worksheets = dashboard.worksheets;
                
                console.log(dashboard);
                console.log(worksheets);

                // Lets grab our sheet names to be able to present user for selection
                this.sheets = worksheets.map( (ws, idx) => ws.name )
                console.log(this.sheets);
                this.selectify();
                
            });
            
        },
        beforeMount: function(){
            console.log('beforeMount');
            
        },
        mounted: function(){
           console.log('mounted')
            
        },
        methods: {

            selectify: function(){
                console.log('selectify');
                setTimeout(() => {
                    var elems = document.querySelectorAll('select');
                    var instances = M.FormSelect.init(elems, {});
                }, 0)
                
            },

            onSheetChange: function(){
                getFilters(this.selectedSheet)
                    .then((filters) => {
                        console.log('current filters');
                        console.log(filters);
                        // Grab our the filter name and update our state to reflect in UI
                        this.filters = filters.map(f => f.fieldName)
                        
                        // We need to have our materialize select update
                        this.selectify();

                        setTimeout( () => {
                            M.AutoInit();
                        })
                    })
                    .catch((err) => {

                    })
                
            },

            onFilterChange: function(){
                getFilters(this.selectedSheet)
                    .then((filters) => {
                        // Find the filter object that the user selected
                        let f = filters.find(f => f.fieldName == this.selectedFilter)
                        return getFilterValues(f);
                    })
                    .then((filterValues) => {
                        console.log(filterValues)
                        this.values = filterValues;
                        this.selectify();
                    })
                    .catch( (err) => {

                    })
            }


        }
    })

    function getFilters(worksheetName){
        return new Promise( (resolve, reject) => {
            // Lets find the requested worksheet
            let ws = worksheets.find(x => x.name == worksheetName)
            console.log('found worksheet');
            console.log(ws);
            ws.getFiltersAsync()
                .then(resolve)
                .catch(reject)
        })
    }

    function getFilterValues(filter){
        return new Promise( (resolve, reject) => {
            let values = []
            try{
                // Wrapped in a try just in case we break something on accident
                switch(filter.filterType){
                    case 'categorical':
                        values = filter.appliedValues.map(v => v.formattedValue);
                        break;
                }
                resolve(values);

            }catch(err){
                reject(err);
            }
            

            
        })
        
    }

    // $('#close-dialog').click(closeDialog)


//     tableau.extensions.initializeDialogAsync().then(function () {
//         // The openPayload sent from the parent extension in this example is the
//         // default time interval for the refreshes.  This could alternatively be stored
//         // in settings, but is used in this sample to demonstrate open and close payloads.
//         // code goes here
//         let currentSettings = tableau.extensions.settings.getAll();
//         configOpts = JSON.parse(currentSettings[_key]);
//         // $('#formSelect #select_label').val(configOpts.label);
//         // $('#formSelect #select_placeholder').val(configOpts.placeholder);

//         // To get filter info, first get the dashboard.
//         const dashboard = tableau.extensions.dashboardContent.dashboard;
//         let filterArr = [];
//         // Then loop through each worksheet and get its filters, save promise for later.
//         dashboard.worksheets.forEach(function (worksheet) {
//             filterArr.push(worksheet.getFiltersAsync());
//             console.log(worksheet);
//             worksheet.getSummaryDataAsync().then(function (sumdata) {

//                 const worksheetData = sumdata;
//                 console.log('worksheet data')
//                 console.log(worksheetData);
//                 // The getSummaryDataAsync() method returns a DataTable
//                 // Map the DataTable (worksheetData) into a format for display, etc.
              
//             });

//             worksheet.getUnderlyingDataAsync().then( (underlyingData) => {
//                 console.log('underlying data');
//                 console.log(underlyingData);
//             })
//         });
        
//         console.log('iterated through worksheets')
//         Promise.all(filterArr)
//             .then( (filtersForWorksheet) => {
//                 // Dont do anything with empty filters
//                 if (filtersForWorksheet.length === 0)
//                     return console.log('no filters in any workbooks');

//                 console.log(filtersForWorksheet)
//                 // Will store each worksheet as a key any potential filter candidates inside
//                 let filtersToChooseFrom = {}
//                 filtersForWorksheet.forEach( (filters, idx) => {
//                     console.log(filters);

//                     // Iterate through each filter the current worksheet may have
//                     filters.forEach( (f) => {
//                         console.log(f.filterType)
                    
//                         if(f.filterType == 'categorical'){
//                             // null coallesce if we dont have any values yet
//                             filtersToChooseFrom[f.worksheetName] = filtersToChooseFrom[f.worksheetName] || [];
                            
//                             let values = []; // Stores all possible options
//                             f.appliedValues.forEach(function (value) {
//                                 values.push(value.formattedValue)
//                             });
                            
                            
//                             filtersToChooseFrom[f.worksheetName].push({
//                                 name: f.fieldName,
//                                 values
//                             })
//                         }
//                     })

                    
                    
//                     // configOpts.filters.push(f)
//                 })
//                 console.log(filtersToChooseFrom);
//                 // configOpts.sheetsToFilter

//                 configOpts.filter = {
//                     name: 'Filter 1',
//                     values: [{name: 'blue', value: 'bl'}, {name: 'red', value: 'r'}]
//                 };
//             })
//     });


//     // $('#formSelect').on('submit', () => {
//     //     configOpts.label = configureForm.selectLabel.value;
//     //     configOpts.placeholder = configureForm.selectPlaceholder.value;
//     //     console.log('saving');
//     //     console.log(configOpts);
//     //     closeDialog();

//     //     return false;
//     // })

//     function closeDialog() {
//         let currentSettings = tableau.extensions.settings.getAll();
//         tableau.extensions.settings.set(_key, JSON.stringify(configOpts));
    
//         tableau.extensions.settings.saveAsync().then((newSavedSettings) => {
//             tableau.extensions.ui.closeDialog();
//         });
//     }
})

})()