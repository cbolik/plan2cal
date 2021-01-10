#!/usr/local/bin/node

const fs = require("fs");
const { exec } = require("child_process");

if (process.argv.length != 6) {
  console.log("Usage: plan2cal csv_file map_json_file date num_weeks");
  console.log("  date is typically a Monday, format: YYYY-MM-DD");
  process.exit(1);
}

const csvPath = process.argv[2];
const mapPath = process.argv[3];
const firstDate = process.argv[4];
const numWeeks = parseInt(process.argv[5]);

console.log("Reading " + csvPath)
const buf = fs.readFileSync(csvPath, "utf8");
const lines = buf.split("\n");
console.log(lines.length + " lines");

console.log("Reading " + mapPath);
const mapStr = fs.readFileSync(mapPath, "utf8");
calMap = JSON.parse(mapStr);
console.log(calMap);

let isSlotLine = false;
let Monday = [];
let Tuesday = [];
let Wednesday = [];
let Thursday = [];
let Friday = [];
let Saturday = [];
let Sunday = [];
let firstSlotTime = "";

for (let line of lines) {
  const parts = line.split(",");
  if (isSlotLine) {
    if (!firstSlotTime) {
      firstSlotTime = parts[0];
    }
    Monday.push(parts[1].replace(/\r?\n|\r/, ""));
    Tuesday.push(parts[2].replace(/\r?\n|\r/, ""));
    Wednesday.push(parts[3].replace(/\r?\n|\r/, ""));
    Thursday.push(parts[4].replace(/\r?\n|\r/, ""));
    Friday.push(parts[5].replace(/\r?\n|\r/, ""));
    Saturday.push(parts[6].replace(/\r?\n|\r/, ""));
    Sunday.push(parts[7].replace(/\r?\n|\r/, ""));
  } else {
    if (parts[1] === "Montag" || parts[1] === "Monday") {
      isSlotLine = true;
    }
  }
}

// console.log("Monday", Monday);
// console.log("Tuesday", Tuesday);
// console.log("Wednesday", Wednesday);
// console.log("Thursday", Thursday);
// console.log("Friday", Friday);
// console.log("Saturday", Saturday);
// console.log("Sunday", Sunday);
// console.log("firstSlotTime", firstSlotTime);

const getTimeString = (slotOffset) => {
  const [hour, mins] = firstSlotTime.split(":");
  let startTimeStr;

  if (mins === "30") {
    const startTime = Number(hour) + 1 + Math.floor(slotOffset / 2);
    if (slotOffset % 2 === 0) {
      startTimeStr = `${startTime - 1}:30`;
    } else {
      startTimeStr = `${startTime}:00`;
    }
  } else if (mins === "00") {
    const startTime = Number(hour) + Math.floor(slotOffset / 2);
    if (slotOffset % 2 === 0) {
      startTimeStr = `${startTime}:00`;
    } else {
      startTimeStr = `${startTime}:30`;
    }
  } else {
    console.log(`Unsupported start time of first slot: ${firstSlotTime}, needs to be x:00 or x:30`);
    process.exit(1);
  }
  return startTimeStr;
};

const createEvent = (slotOffset, slotCount, prevSlot, dayOffset) => {
  const startTimeStr = getTimeString(slotOffset);
  const endTimeStr = getTimeString(slotOffset + slotCount);
  const summary = prevSlot;
  if (summary.trim().length > 0) {
    const cal = calMap[summary];
    if (cal) {
      exec(
        `./create-event.js "${cal}" ${firstDate} ${dayOffset} ${startTimeStr} ${endTimeStr} "${summary}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            return;
          }
          if (stderr) {
            console.error(`stderr: ${stderr}`);
          } else {
            console.log(
              `created event: ${cal} ${firstDate} ${dayOffset} ${startTimeStr} ${endTimeStr} ${summary}`
            );
          }
          if (stdout) {
            console.log(`stdout: ${stdout}`);
          }
        }
      );
    }
  }
}

const createEvents = (daySlots, dayOffset, weekDay, weekNum) => {
  let prevSlot = "_";
  let slotCount = 0;
  let slotOffset = 0;
  console.log(`Starting to create events for ${weekDay}, week ${weekNum + 1} ...`);
  for (let slot of daySlots) {
    if (slot !== prevSlot && prevSlot !== "_") {
      // create calendar entry for previously encountered slot
      createEvent(slotOffset, slotCount, prevSlot, dayOffset);
      
      slotOffset += slotCount;
      slotCount = 1;
    } else {
      slotCount++;
    }
    prevSlot = slot;
  }
  // create calendar entry for last encountered slot
  createEvent(slotOffset, slotCount, prevSlot, dayOffset);
}

const throttleDelayMS = 5000;

for (let i = 0; i < numWeeks; i++) {
  setTimeout(() => createEvents(Monday, i * 7 + 0, "Monday", i), i*7 * throttleDelayMS);
  setTimeout(() => createEvents(Tuesday, i*7 + 1, "Tuesday", i), (i*7+1) * throttleDelayMS);
  setTimeout(() => createEvents(Wednesday, i*7 + 2, "Wednesday", i), (i*7+2) * throttleDelayMS);
  setTimeout(() => createEvents(Thursday, i*7 + 3, "Thursday", i), (i*7+3) * throttleDelayMS);
  setTimeout(() => createEvents(Friday, i*7 + 4, "Friday", i), (i*7+4) * throttleDelayMS);
  setTimeout(() => createEvents(Saturday, i*7 + 5, "Saturday", i), (i*7+5) * throttleDelayMS);
  setTimeout(() => createEvents(Sunday, i * 7 + 6, "Sunday", i), (i * 7+6) * throttleDelayMS);
}
