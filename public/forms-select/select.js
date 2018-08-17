$(document).ready(function(){
    const _key = 'select_opts';

    let dashboard;    

    var app = new Vue({
        el: '#app',
        data: {
            showWelcome: true,

            // These are powered from work done in the configure screen and come back as key/value
            label: "", // User defined
            placeholder: "", // User defined
            values: [], // Come from the worksheets filter values
            selected: "", // The actual value(s) that the user selected
            mutliple: false, // Whether or not multiple values are allowed to be selected

            worksheetName: "", // The name of the worksheet the user selected
            filterName: "", // The name of the filter the user selected for a worksheet
        },
        created: function(){
            tableau.extensions
                .initializeAsync({ 'configure':  () => {  configure(this.handleUpdates) } })
                .then( () => {
                    
                    // Initialization succeeded! Get the dashboard
                    dashboard = tableau.extensions.dashboardContent.dashboard;
                    console.log(dashboard)
                })
        },
        methods: {
            selectify: function(){
                console.log('selectify');
                setTimeout( () => {
                    var elems = document.querySelectorAll('select');
                    var instances = M.FormSelect.init(elems, {});
                }, 0)
            },

            handleConfigure: function(){
                console.log('handle configure');
                configure(this.handleUpdates);
            },

            handleUpdates: function(data){
                console.log('handle udpates');
                this.showWelcome = false;
                
                
                this.label = data.label;
                this.placeholder = data.placeholder;
                this.values = data.values;
                this.worksheetName = data.sheet;
                this.filterName = data.filter;
                this.multiple = data.multiple;
                
                this.selectify();
            },

            handleChange: function(){
                worksheets = dashboard.worksheets;
                // let ws = worksheets.find(w => w.name == this.worksheetName)
                console.log('found worksheet');
                // console.log(ws);
                
                var filterVals = (this.selected instanceof Array) ? this.selected : [this.selected];

                worksheets.forEach( (ws) => {
                    ws.applyFilterAsync(
                        this.filterName,
                        filterVals,
                        "replace"
                    )
                })
                
                    

            }
        }
    });


    function configure(callback){
        // This uses the window.location.origin property to retrieve the scheme, hostname, and 
        // port where the parent extension is currently running, so this string doesn't have
        // to be updated if the extension is deployed to a new location.
        const popupUrl = `${window.location.origin}/forms-select/select-configure.html`;

        // Pass these two our configuration manager to allow user to make changes
        //tableau.extensions.settings.set(_key, JSON.stringify(configOpts));
    
        tableau.extensions.ui.displayDialogAsync(popupUrl, null, { height: 500, width: 500, padding: 0, margin: 0 })
            .then((configOpts) => {
                let currentSettings = tableau.extensions.settings.getAll();
                let opts = JSON.parse(currentSettings[_key]);
                console.log(opts)

                if(callback)
                    callback(opts);
            }).catch((error) => {
                console.error(error);
            });

        // tableau.extensions.settings.saveAsync()
        //     .then((newSavedSettings) => {
        //         console.log('main page saved select options');
                
        //     });

    }
})


    