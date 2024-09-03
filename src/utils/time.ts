import moment from 'moment';
import momentz from 'moment-timezone';
const timeZone = 'Asia/Dubai';

export const now = () => {
  return moment.utc().format();
};
export const getLocalTime = () => {
  return moment().tz(timeZone).format();
};

export const convertToLocalTime = (time) => {
  return momentz.tz(time, timeZone).format('LLLL');
};
