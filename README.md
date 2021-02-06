# plan2cal
From time to time I sit down and plan my upcoming week in half-hourly slots for all seven days, using a Google Sheet (or MS Excel sheet) for simplicity. To each of the slots I assign a category of what I want to do during that time, e.g. Work, Run, Piano, etc..

This tool reads a CSV created from the spreadsheet and creates calendar entries in the Mac OS Calendar app accordingly, automatically, for a whole week or multiple weeks in a row. This way I have my weekly plan on all my (Apple) devices, without having to go through the tedious effort of creating calendar entries manually.

The tool consists of the following files:

* [plan2cal.js]: The main JavaScript file, makes use of Node.js packages fs and child_process
* [create-event.js]: An Apple Script JS file which creates an individual event in the Calendar. This is based on code taken from Apple's [Calendar Scripting Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Conceptual/CalendarScriptingGuide/index.html).
  * Theoretically, if other platforms provide a similar interface of scripting calendar event creation, only this file would need to be replaced for another platform-specific script, e.g. for Linux or Windows.
* [sum2cal-sample.json]: A configuration file providing the mapping between CSV cell labels (e.g. "Piano") to the name of a pre-existing calendar (e.g. "Music"). For the example given, this would create an event labelled "Piano" in the calendar "Music" for all occurences of "Piano" in the source CSV file.
* [Sample Baseline.csv](Sample%20Baseline.csv): A sample csv file, to be used with the sum2cal-sample.json file also provided. Note that in order for plan2cal to properly find the calendar in the CSV file it needs to be laid out in a 2-dimensional area, with the slot start times in the left-most column, and weekday names in English in the top row of the area. See the [sample](Sample%20Baseline.csv) for an example.

## Usage

In order to have plan2cal read a CSV file and create calendar entries use the following command line:
```
plan2cal.js csv_file map_json_file date num_weeks
```

The date (usually a Monday) needs to be formatted like this: YYYY-MM-DD. 

In order to generate Calendar entries for the Sample Baseline.csv provided, for one week starting on Feb 1st 2021, first make sure the calendar specified in the sum2cal-sample.json file exists in your calendar (create the ones missing, they can be deleted again afterwards), then try the following:

```
./plan2cal.js "Sample Baseline.csv" sum2cal-sample.json 2021-02-01 1
```

## Contribute

Feel free to fork this repo and create your own enhancements, and please let [me](mailto:cbolik@gmx.net) know if you do. Thanks!
