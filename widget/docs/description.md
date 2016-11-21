# Veracode data at your finger tips
View a summary of the latest Veracode scan results without leaving VSTS! Just put the Latest Veracode Scan Summary Widget on your VSTS dashboard, and keep tabs on how secure your code is. Need to track several applications on a single dashboard? No problem - just add widgets to your dashboard as needed.

![LatestWidgetExample](../images/example-pass.png)

# Configuration
## Installation
After you install the widget in your account, you will need to add the widget to your dashboard. If you are unsure how to do that, please see the following documentation:
* [Get extensions for Visual Studio Team Services](https://www.visualstudio.com/docs/marketplace/get-vsts-extensions) to learn how to install extensions.
* [Dashboard documentation](https://www.visualstudio.com/docs/report/dashboards) to learn how to add a widget.

## Configuring the Widget
1. *Veracode Application Id:* the id used by Veracode to identify the application. 
2. *Veracode API User:* the user name the widget should use to connect to the Veracode API
3. *Veracode API Password:* the password the widget should use to connect to the Veracode API 

Once configured, the widget will take a few seconds to connect to the Veracode system. The widget will automatically display in red if the scan fails to meet any policy constraints. The large number shows the total number of unmitigated flaws identified by Veracode. 

# Support
If you find an issue, need help or have improvement suggestions you can do so by raising an issue on the widget [GitHub](https://github.com/headforwards/VeracodeVSTSWidgets) page. Or why not help out by creating a pull request?