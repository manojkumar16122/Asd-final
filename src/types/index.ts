export interface UserData {
  name: string;
  age: number;
  diagnosis: string;
  therapist: string;
  lastSession: string;
  [key: string]: any;
}

export interface HeartRateData {
  timestamp: number;
  value: number;
}

export interface HeartRateChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    fill: boolean;
  }[];
}