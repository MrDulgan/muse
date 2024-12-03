export const chunk = <T>(arr: T[], len: number): T[][] => {
  if (len <= 0) throw new Error("Chunk size must be greater than 0");

  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += len) {
    chunks.push(arr.slice(i, i + len));
  }

  return chunks;
};
