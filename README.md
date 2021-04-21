# AdvancedSort Component for Kendo Grid - .Net Core Version

This project is aimed to create a kendo advanced sort using razor class library, for the purpose of reusability and modularity. 

/*Usage*/

This component is a asp.net mvc core driven class library project, so the client project can use this compenent by referencing to this project dll.

Pre-Requisite:

    - This component is created for .NET Core 3.1, so the client ptoject should also be .NET Core 3.1 or above
    - This project is a custom component extention for Kendo MVC dll. So the client project must have all the Kendo MVC references added.

/*Adding the component to the project:*/

    via Nuget
        - Create a custom nuget packge source with path \\nuget-offline\package\
        - Search for Kendo.Component.AdvancedSort.Mvc.Core and install the latest version
    
    Then use any of the following option to configure your page to have advansed sort

        - Add namspace to the view
            @using Kendo.Component.AdvancedSort.Mvc.Core

        - Using MVC HTMLHelper (recommended)

            Basic: 
                @Html.AdvancedSortFor("{grid-name}")

            With Custom Style to Buttons: 
                @Html.AdvancedSortFor("{grid-name}", new { ButtonOpenSortStyle = "margin: 0", ButtonClearSortStyle = "margin: 0" })

            With Excluded Column List: 
                @Html.AdvancedSortFor("{grid-name}", new List<string>{ "Column1", "Column2" })

            With default style to Sort Inidcator:
                @Html.AdvancedSortFor("{grid-name}", new { UseDefaultSortIconStyle: true })

                You can use this switch and set it to false, if you see the sort indicator style looks wired after adding the advanced sort

            With no auto intialize:
                @Html.AdvancedSortFor("{grid-name}", new { PreventAutoInitialize: true })

                When this switch is set to true. The component is added to the view but not intialised. You have to manually initialize from client side using the below code.

                    $('#{grid-name}').AdvancedSortGridExtention().init({
                        excludedColumn: ["column1","column2"],  //optional
                        localStorageKey: 'storagekey'           //optional, default is empty. By default grid name is used as a storage key, but in cases when grid name is same for mutiple grids, use this attr to set the custom key for local storage.
                    });

                This is helpful in case like, the grid refreshes based on a dropdown change event. You put this, after the code that loads/refresh the grid. 
           
           Support for client template:
                In most cases the grid toolbar controls are rendered as a kendo template. So it is necessary to account for escaping some standard kendo reserved syntaxes like #.
                Use the switch 'RenderAsClientTemplate' and set it to true, when the advacned sort is part of the kendo template

                e.g. @Html.AdvancedSortFor("{grid-name}", new { RenderAsClientTemplate: true })

        - Using Javascript code. This is usefull when you are required to add Advanced Sort dynamically.

            1. Load the Static resources to the page by putting the below code on the page head
                 @using Kendo.Component.AdvancedSort.Mvc.Core
                 @Html.AdvancedSortSharedResource()

            2. Create a placeholder for the advanced sort control to load in, e.g. <div id="advancedSortPanel"></div>. This would usually goes inside the grid toolbar container.

            3. Intialise the sort using below code. This should be called after the kendo grid is initialised. 

                $("#advancedSortPanel").AdvancedSort({
                    gridName: 'your-grid-name',             //required
                    excludedColumn: ["column1","column2"],  //optional
                    localStorageKey: 'storagekey'           //optional, default is empty. By default grid name is used as a storage key, but in cases when grid name is same for mutiple grids, use this attr to set the custom key for local storage.
                    buttonOpenSortStyle: 'margin: 0',       //optional
                    buttonClearSortStyle: 'margin: 0',      //optional
                    UseDefaultSortIconStyle: true           //optional, default is false
                });

/*Packing and deploying:*/

    This component is deployed as nuget package for the consuming app. So please follow the below steps to deploy this component, whenever a change has been made.

    1.First Update the major or minor version depends on your change. 
        - Right click on the project, go to properties, and then go to package section.
        - Update the version number under Package Version, Assembly version & Assembly file version.
        - Give some notes about your chage in Release Notes section

    2.Now Publish (right click on the project in VS and click on publish) the app. This will create a Kendo.Component.AdvancedSort.Mvc.Core.1.0.0.nupkg file 
      under '{your project root folder}\WebComponentLibrary\Kendo.Component.AdvancedSort.Mvc.Core\bin\Release\netcoreapp3.1\publish' folder

    3.Next step is to use nuget.exe to deploy the package to shared package folder.
      - If you dont have already, please download the nuget.exe from here https://www.nuget.org/downloads
      - Shared package folder for our nuget packages is \\nuget-offline\package\

        Now follow the below steps

        - Open CMD promt in ADMIN mode
        - CD to the location where your nuget.exe file is e.g CD C:\Nuget
        - Run this command 
            'nuget add {your project root folder}\WebComponentLibrary\Kendo.Component.AdvancedSort.Mvc.Core\bin\Release\netcoreapp3.1\publish\Kendo.Component.AdvancedSort.Mvc.Core.1.0.0.nupkg -source \\nuget-offline\package\'
          Dont forget to replace {your project root folder} with your folder path.
  
    You have now deployed a new version of nuget package for this project. Go to your consuming app and update the package to this newer version, as you normally do for any other nuget package.

    Important!!! 
    All tsconfig.json files should be excluded from the build output. You can do that by right clicking the tsconfig.json file, going to properties, setting Build Action to None.
