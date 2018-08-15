$(document).ready(function(){
    const _key = 'select_opts';

    let configOpts = {
        filter: {},
        placeholder: 'Choose an Option',
        label: 'My Select',
        
    }

    tableau.extensions
        .initializeAsync({ 'configure': configure})
        .then( () => {
            $('#container-select').removeClass('hide');
            
            // Initialization succeeded! Get the dashboard
            var dashboard = tableau.extensions.dashboardContent.dashboard;
            console.log(dashboard)
        })

    function selectify(opts){

        let optHtml = opts.filter.values.map( (f, idx) => {
            return `<option value="${f.value}">${f.name}</option>`;
        })

        let html = 
        `
        <div class="input-field col s12">
            <select>
                <option value="" disabled selected>${opts.placeholder}</option>
                ${optHtml}
            </select>
            <label>${opts.label}</label>
        </div>
        `

        $('#container-select').html(html);
        setTimeout( () => {
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, {});
        }, 0)

    }

    function configure(){
        // This uses the window.location.origin property to retrieve the scheme, hostname, and 
        // port where the parent extension is currently running, so this string doesn't have
        // to be updated if the extension is deployed to a new location.
        const popupUrl = `${window.location.origin}/forms-select/select-configure.html`;

        // Pass these two our configuration manager to allow user to make changes
        tableau.extensions.settings.set(_key, JSON.stringify(configOpts));
    
        tableau.extensions.settings.saveAsync()
            .then((newSavedSettings) => {
                console.log('main page saved select options');
                tableau.extensions.ui.displayDialogAsync(popupUrl, null, { height: 500, width: 500 }).then((configOpts) => {
                    let currentSettings = tableau.extensions.settings.getAll();
                    let opts = JSON.parse(currentSettings[_key]);
                    console.log(opts)
                    selectify(opts);
                }).catch((error) => {
                    console.error(error);
                });
            });

        
        
    }
})


    