export const prettyTime = (seconds: number): string => {
  if (seconds < 0) throw new Error('Seconds cannot be negative.');

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (num: number) => num.toString().padStart(2, '0');

  return hrs > 0
    ? `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
    : `${pad(mins)}:${pad(secs)}`;
};

export const parseTime = (str: string): number => {
  const parts = str.split(':').map(part => parseInt(part, 10));

  if (parts.some(isNaN)) {
    throw new Error('Invalid time format. Expected format HH:MM:SS or MM:SS.');
  }

  if (parts.length > 3) {
    throw new Error('Invalid time format. Too many parts.');
  }

  let totalSeconds = 0;
  if (parts.length === 3) {
    totalSeconds += parts[0] * 3600;
    totalSeconds += parts[1] * 60;
    totalSeconds += parts[2];
  } else if (parts.length === 2) {
    totalSeconds += parts[0] * 60;
    totalSeconds += parts[1];
  } else {
    totalSeconds += parts[0];
  }

  return totalSeconds;
};
