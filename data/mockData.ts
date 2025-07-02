export interface StationRecord {
  timestamp: string;
  pump1_m10: number;
  pump1_m30: number;
  pump1_m60: number;
  pump2_m10: number;
  pump2_m30: number;
  pump2_m60: number;
  pump3_m10: number;
  pump3_m30: number;
  pump3_m60: number;
}

// Generate 24 hourly rows for each station/depth
export const mockDataLocation1: StationRecord[] = Array.from({ length: 24 }, (_, i) => {
  const ts = new Date();
  ts.setHours(ts.getHours() - (23 - i), 0, 0, 0);
  return {
    timestamp: ts.toISOString(),
    pump1_m10: Math.round(Math.random() * 100),
    pump1_m30: Math.round(Math.random() * 100),
    pump1_m60: Math.round(Math.random() * 100),
    pump2_m10: Math.round(Math.random() * 100),
    pump2_m30: Math.round(Math.random() * 100),
    pump2_m60: Math.round(Math.random() * 100),
    pump3_m10: Math.round(Math.random() * 100),
    pump3_m30: Math.round(Math.random() * 100),
    pump3_m60: Math.round(Math.random() * 100),
  };
});
