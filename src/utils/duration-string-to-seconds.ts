import parse from 'parse-duration';

const durationToSeconds = (input: string | number): number => {
  if (typeof input === 'number') {
    if (input < 0) throw new Error("Duration cannot be negative.");
    return input;
  }

  const trimmedInput = input.trim();

  if (/^\d+$/.test(trimmedInput)) {
    const seconds = Number.parseInt(trimmedInput, 10);
    if (isNaN(seconds)) throw new Error("Invalid numeric input for duration.");
    return seconds;
  }

  const parsedMilliseconds = parse(trimmedInput);
  if (parsedMilliseconds === null || isNaN(parsedMilliseconds)) {
    throw new Error("Invalid duration format.");
  }

  return Math.floor(parsedMilliseconds / 1000);
};

export default durationToSeconds;
