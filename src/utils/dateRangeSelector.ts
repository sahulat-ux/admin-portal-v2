import moment from 'moment';

export const handleDateRangeSelection = (range: string) => {
  let start: string = '';
  let end: string = '';

  switch (range) {
    case 'Today':
      start = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'Yesterday':
      start = moment().subtract(1, 'day').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().subtract(1, 'day').endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'Last 7 Days':
      start = moment().subtract(6, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'Last 30 Days':
      start = moment().subtract(29, 'days').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'This Month':
      start = moment().startOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().endOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'Last Month':
      start = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    case 'All Time':
      start = moment('2000-01-01').startOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      end = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZ');
      break;
    default:
      break;
  }

  return { start, end };
};
