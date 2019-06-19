'use strict';

const intervals = require(__dirname + '/../timers.json');
const fs = require('fs');

const MILISECONDS_IN_ONE_HOUR = 3600000;

const intervalsObjects = [];

intervals.update = (chatId, interval) => {
  if (chatId !== undefined) {
    const intervalObject = setInterval(
      intervals.callback,
      interval * MILISECONDS_IN_ONE_HOUR,
      chatId
    );
    const rowIndex = intervals.findIndex(([rowChatId]) => rowChatId === chatId);
    if (rowIndex > -1) {
      const oldIntervalObject = intervalsObjects.splice(rowIndex, 1, intervalObject)[0];
      clearInterval(oldIntervalObject);
      intervals[rowIndex][1] = interval;
    } else {
      intervals.push([chatId, interval]);
      intervalsObjects.push(intervalObject);
    }
  }
  fs.writeFile(__dirname + '/timers.json', JSON.stringify(intervals), error => {
    // TODO: FATAL write timers
  });
};

intervals.start = callback => {
  intervals.forEach(([chatId, interval]) => {
    const intervalObject = setInterval(
      callback,
      interval * MILISECONDS_IN_ONE_HOUR,
      chatId
    );
    intervalsObjects.push(intervalObject);
  });
  intervals.callback = callback;
};

intervals.delete = index => {
  intervals.splice(index, 1);
  const intervalObject = intervalsObjects.splice(index, 1)[0];
  clearInterval(intervalObject);
  intervals.update();
}

module.exports = intervals;
