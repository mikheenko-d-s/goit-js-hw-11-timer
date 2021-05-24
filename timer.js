export default class CountdownTimer {
  #TIME_UNITS = [
    'days',
    'hours',
    'mins',
    'secs',

    'days0',
    'days1',
    'hours1',
    'mins1',
    'secs1',

    'days2',
    'hours2',
    'mins2',
    'secs2',
  ];

  #TIMECARD_ANIMATION_KEYFRAMES = [
    {
      transform: 'rotateX(0deg) scaleY(-1)',
      opacity: 0,
    },
    {
      transform: 'rotateX(-180deg) scaleY(-1)',
      opacity: 1,
    },
    {
      transform: 'rotateX(-150deg) scaleY(-1)',
    },
    {
      transform: 'rotateX(-180deg) scaleY(-1)',
    },
  ];

  #TIMECARD_ANIMATION_PARAMS = {
    duration: 500,
    iterations: 1,
  };

  constructor({ selector, targetDate, animate = false }) {
    this.timerRef = document.querySelector(selector);
    this.TARGET_DATE = targetDate;
    this.SHALL_ANIMATE = animate;

    this.prevTimeLeft = this.getSplittedTime(this.TARGET_DATE - new Date());

    this.timerFieldsRef = this.getTimerFieldRefs(this.timerRef);

    this.initTimer();
  }

  getTimerFieldRefs(timerRef) {
    return this.#TIME_UNITS.reduce((result, timeUnit) => {
      const ref = timerRef.querySelector(`[data-value="${timeUnit}"]`);

      if (ref !== null) {
        result[timeUnit] = ref;
      }

      return result;
    }, {});
  }

  addLeadingZeros(str, strLength) {
    return '0'.repeat(strLength - str.toString().length) + str;
  }

  getSplittedTime(time) {
    const getFirstDgt = num => Math.floor((num % 100) / 10);
    const getSecondDgt = num => num % 10;

    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((time % (1000 * 60)) / 1000);

    const arrayOfTimePeriods = [days, hours, mins, secs];

    const days0 = Math.floor(days / 100);
    const [days1, hours1, mins1, secs1] = arrayOfTimePeriods.map(getFirstDgt);
    const [days2, hours2, mins2, secs2] = arrayOfTimePeriods.map(getSecondDgt);

    return {
      days,
      hours,
      mins,
      secs,

      days0,
      days1,
      hours1,
      mins1,
      secs1,

      days2,
      hours2,
      mins2,
      secs2,
    };
  }

  hasSecPassed(prevTime) {
    return Math.abs(new Date().getSeconds() - prevTime.getSeconds()) >= 1;
  }

  resetTimer() {
    clearInterval(this.timerID);

    Object.values(this.timerFieldsRef).forEach(ref => {
      ref.textContent = '--';
    });
  }

  refreshTimer(time) {
    if (time <= 0) {
      this.resetTimer();
      return;
    }

    const currentTimeLeft = this.getSplittedTime(time);

    Object.keys(this.timerFieldsRef).forEach(key => {
      const outputLength = /\d$/.test(key) ? 1 : 2;
      this.timerFieldsRef[key].textContent = this.addLeadingZeros(
        currentTimeLeft[key],
        outputLength,
      );

      if (
        this.SHALL_ANIMATE &&
        this.prevTimeLeft[key] !== currentTimeLeft[key]
      ) {
        this.timerFieldsRef[key].animate(
          this.#TIMECARD_ANIMATION_KEYFRAMES,
          this.#TIMECARD_ANIMATION_PARAMS,
        );
      }
    });

    this.prevTimeLeft = currentTimeLeft;
  }

  initTimer() {
    let prevTime = new Date(0);

    this.timerID = setInterval(() => {
      if (!this.hasSecPassed(prevTime)) return;

      prevTime = new Date();
      this.refreshTimer(this.TARGET_DATE - prevTime);
    }, 100);
  }
}
