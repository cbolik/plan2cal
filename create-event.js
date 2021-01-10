#!/usr/bin/osascript

function run(argv){

    if (argv.length != 6) {
        console.log("Usage: scriptname calendar_name date day_offset start_time end_time summary");
        console.log("  date format: YYYY-MM-DD");
        console.log("  time format: hh:mm\n");
        console.log("Command line arguments received:");
        for (var i = 0; i < argv.length; i++) {
          console.log(i+1, argv[i]);
        }

    } else {

        calendar_name = argv[0];

        summary = argv[5];

        day_offset = parseInt(argv[2]);
        date = argv[1];
        start_time = argv[3].split(":");
        end_time = argv[4].split(":");

        var app = Application.currentApplication();
        app.includeStandardAdditions = true;
        var Calendar = Application("Calendar");

        var eventStart = new Date(date);
        if (day_offset != 0) {
            eventStart.setDate(eventStart.getDate() + day_offset);
        }

        eventStart.setHours(start_time[0]);
        eventStart.setMinutes(start_time[1]);
        eventStart.setSeconds(0);

        var eventEnd = new Date(date);
        if (day_offset != 0) {
          eventEnd.setDate(eventEnd.getDate() + day_offset);
        }

        eventEnd.setHours(end_time[0]);
        eventEnd.setMinutes(end_time[1]);
        eventEnd.setSeconds(0);

        var projectCalendars = Calendar.calendars.whose({ name: calendar_name });
        var projectCalendar = projectCalendars[0];

        var event = Calendar.Event({
        summary: summary,
        startDate: eventStart,
        endDate: eventEnd,
        });
        projectCalendar.events.push(event);
        event;

    }


}

