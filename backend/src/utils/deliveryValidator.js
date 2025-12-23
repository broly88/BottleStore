const SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2024 = [
  '2024-01-01', // New Year's Day
  '2024-03-21', // Human Rights Day
  '2024-03-29', // Good Friday
  '2024-04-01', // Family Day
  '2024-04-27', // Freedom Day
  '2024-05-01', // Workers' Day
  '2024-06-16', // Youth Day
  '2024-08-09', // National Women's Day
  '2024-09-24', // Heritage Day
  '2024-12-16', // Day of Reconciliation
  '2024-12-25', // Christmas Day
  '2024-12-26', // Day of Goodwill
];

const SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2025 = [
  '2025-01-01',
  '2025-03-21',
  '2025-04-18',
  '2025-04-21',
  '2025-04-27',
  '2025-05-01',
  '2025-06-16',
  '2025-08-09',
  '2025-09-24',
  '2025-12-16',
  '2025-12-25',
  '2025-12-26',
];

const PUBLIC_HOLIDAYS = [
  ...SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2024,
  ...SOUTH_AFRICAN_PUBLIC_HOLIDAYS_2025,
];

const DELIVERY_HOURS = {
  start: 9,
  end: 18,
};

export const isSunday = (date) => {
  const d = new Date(date);
  return d.getDay() === 0;
};

export const isPublicHoliday = (date) => {
  const dateStr = new Date(date).toISOString().split('T')[0];
  return PUBLIC_HOLIDAYS.includes(dateStr);
};

export const isWithinDeliveryHours = (hour) => {
  return hour >= DELIVERY_HOURS.start && hour < DELIVERY_HOURS.end;
};

export const canDeliverOnDate = (date) => {
  const deliveryDate = new Date(date);

  if (isSunday(deliveryDate)) {
    return {
      canDeliver: false,
      reason: 'Alcohol delivery is not permitted on Sundays in South Africa',
    };
  }

  if (isPublicHoliday(deliveryDate)) {
    return {
      canDeliver: false,
      reason: 'Alcohol delivery is not permitted on public holidays',
    };
  }

  return {
    canDeliver: true,
    reason: null,
  };
};

export const getNextAvailableDeliveryDate = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);

  while (!canDeliverOnDate(date).canDeliver) {
    date.setDate(date.getDate() + 1);
  }

  return date;
};

export const validateDeliveryDateTime = (dateTime) => {
  const dt = new Date(dateTime);
  const hour = dt.getHours();

  const dateCheck = canDeliverOnDate(dt);
  if (!dateCheck.canDeliver) {
    return dateCheck;
  }

  if (!isWithinDeliveryHours(hour)) {
    return {
      canDeliver: false,
      reason: `Delivery hours are ${DELIVERY_HOURS.start}:00 - ${DELIVERY_HOURS.end}:00 Monday to Saturday`,
    };
  }

  return {
    canDeliver: true,
    reason: null,
  };
};

export default {
  isSunday,
  isPublicHoliday,
  isWithinDeliveryHours,
  canDeliverOnDate,
  getNextAvailableDeliveryDate,
  validateDeliveryDateTime,
  DELIVERY_HOURS,
};
