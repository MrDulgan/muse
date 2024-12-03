const getProgressBar = (width: number, progress: number): string => {
  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(progress, 1));
  const dotPosition = Math.floor(width * clampedProgress);

  const bar = Array.from({ length: width }, (_, i) => 
    i === dotPosition ? '🔘' : '▬'
  ).join('');

  return bar;
};

export default getProgressBar;
