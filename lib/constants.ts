export const LOCATIONS_LIST = [
  { id: 'pump1', name: 'PUMP HOUSE 1' },
  { id: 'pump2', name: 'PUMP HOUSE 2' },
  { id: 'pump3', name: 'PUMP HOUSE 3' },
];
export const LOCATION_NAMES: Record<string,string> = LOCATIONS_LIST.reduce(
  (acc, { id, name }) => ((acc[id] = name), acc),
  {} as Record<string,string>
);

export const STATIONS = [
  { key: 'pump1', label: 'Station 1' },
  { key: 'pump2', label: 'Station 2' },
  { key: 'pump3', label: 'Station 3' },
];
export const DEPTHS = [
  { key: 'm10', label: '10 cm' },
  { key: 'm30', label: '30 cm' },
  { key: 'm60', label: '60 cm' },
];
