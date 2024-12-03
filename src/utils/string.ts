const truncate = (text: string, maxLength = 50): string => {
  if (maxLength < 1) throw new Error('maxLength must be at least 1');

  if (text.length <= maxLength) {
    return text;
  }

  const ellipsis = '...';
  if (maxLength <= ellipsis.length) {
    return ellipsis.slice(0, maxLength);
  }

  return `${text.slice(0, maxLength - ellipsis.length)}${ellipsis}`;
};

export default truncate;
