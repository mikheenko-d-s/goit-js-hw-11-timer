import CountdownTimer from './timer.js';

const dateOfNextDay = new Date(
  Math.floor(
    (new Date() / 1000 / 60 - new Date().getTimezoneOffset()) / 60 / 24 + 1,
  ) *
    1000 *
    60 *
    60 *
    24 +
    new Date().getTimezoneOffset() * 60 * 1000,
);

const dateOfNextYear = new Date(`Jan 01, ${new Date().getFullYear() + 1}`);

const nextDayConutdown = new CountdownTimer({
  selector: '#timer-1',
  targetDate: dateOfNextDay,
});

const nextYearConutdown = new CountdownTimer({
  selector: '#timer-2',
  targetDate: dateOfNextYear,
  animate: true,
});
