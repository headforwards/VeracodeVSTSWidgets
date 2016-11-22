"use strict";

// updates the widget interface to show the widget is loading otherwise it looks like it has hung
function updateWidgetProgressIndicator(widgetId, stopProgress, message){
    try {
        if (widgetId.indexOf("#") != 0) {
            widgetId = "#" + widgetId;
        }
        var $widget = $(widgetId);
        
        if ($widget !== undefined) {
            // update the progress indicator
            if (stopProgress) {
                $(widgetId + " .veracode-widget-loading").hide();
                $(widgetId + " .veracode-widget-content").show();
            }
            else {
                $(widgetId + " .veracode-widget-loading").show();
                $(widgetId + " .veracode-widget-content").hide();
            }

            if (message !== undefined && stopProgress !== true) {
                $(widgetId + " #loading-text").html = message;
            }
        }
    }
    catch (e) {
        console.log("Unable to updateWidgetProgressIndicator");
        console.log(e);
    }
}

// Takes the scan report data from the Veracode API Wrapper and updates the given widget id
function populateVeracodeScanWidget(data, widgetId) {

    // update the application name
    $(widgetId + " .application-title").html(data.ApplicationName);
    $(widgetId + " .application-title").attr("title", data.ApplicationName + " (version: " + data.Name + ")");

    // update the scan date
    $(widgetId + " .scan-date").html(moment(data.ScanDate).fromNow());
    $(widgetId + " .scan-date").attr("title", "Last Scanned on " + data.ScanDate);

    // update the flaw count
    // if there is no report the service returns Int32.MaxValue
    // we don't want to display this
    if (data.TotalFlaws === 2147483647) {
        // there is no report
        $(widgetId + " .flaw-count").html("-");
        $(widgetId + " .flaw-count").attr("title", "The scan report is not available.");
    }
    else {
        $(widgetId + " .flaw-count").html(data.UnmitigatedFlaws);
        $(widgetId + " .flaw-count").attr("title", data.UnmitigatedFlaws + "/" + data.TotalFlaws + " unmitigated vulnerabilities identified");
    }
    
    // update the scan date
    $(widgetId + " #scan-date").html(moment(data.ScanDate).fromNow());
    $(widgetId + " #scan-date").attr("title", "Last Scanned on " + data.ScanDate);

    if (data.Status === "Pass") {
        $(widgetId).css("background-color", "rgb(51, 153, 51)"); // green
        $(widgetId + " .veracode-shield").addClass("policyDidPass");
    }
    else if (data.Status === "Did Not Pass") {
        $(widgetId).css("background-color", "rgb(229, 20, 0)"); // red
        $(widgetId + " .veracode-shield").addClass("policyDidNotPass");
    }
    else {
        $(widgetId).css("background-color", "rgb(0, 156, 204)"); // blue
        $(widgetId + " .veracode-shield").addClass("policyDidPassWithWarnings");
    }

    // rgb(170, 1, 178) // pink

    // remove the veracode shield if the number of vulnerabilities is more than
    // 99 otherwise the shield will not fit in the 160px width
    if ((data.UnmitigatedFlaws > 99) && (data.TotalFlaws != 2147483647)) {
        $(widgetId + " .veracode-shield").hide();
    }
    else {
        // make sure the shield is visible
        $(widgetId + " .veracode-shield").show();
    }
}

// Query the Veracode API Wrapper to get the scan report for the given scan id 
// and application id, then populate the data into the given widget id
function retrieveVeracodeScanDataForWidget(scanId, widgetId, applicationId, username, password) {

    try {
        if (widgetId.indexOf("#") != 0) {
            widgetId = "#" + widgetId;
        }

        // update the loading UI
        updateWidgetProgressIndicator(widgetId, false, "Retrieving data...");

        $.ajax({
            method: "GET",
            url: "https://headforwards-axappp.azurewebsites.net/api/" + applicationId + "/scans/" + scanId,
            dataType: "json",
            crossDomain: true,
            // xhrFields: {
            //     withCredentials: true
            // },
            timeout: 0,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
            },
            success: function (data, status, jqXHR) {
                if (jqXHR.status === 200) {
                    
                    updateWidgetProgressIndicator(widgetId, false, "Populating widget...");

                    populateVeracodeScanWidget(data, widgetId);

                }
                else {
                    console.log("The API returned an non-success response: " + jqXHR.status);
                }
            },
            error: function (jqXHR, status, error) {
                updateWidgetProgressIndicator(widgetId, false, "Error retrieving data...");
                console.log(jqXHR);
            },
            complete: function () {
                // remove the loading interface
                updateWidgetProgressIndicator(widgetId, true);
            }
        });
    }
    catch (e){
        console.log("An error occurred in retrieveVeracodeScanDataForWidget");
        console.log(e);
    }
}