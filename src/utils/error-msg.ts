const formatErrorMessage = (error?: string | Error): string => {
  const prefix = '🚫 Error:';
  
  if (!error) return `${prefix} Unknown error.`;

  if (typeof error === 'string') {
    return `${prefix} ${error}`;
  }

  if (error instanceof Error) {
    return `${prefix} ${error.message}`;
  }

  // Fallback for unexpected types
  return `${prefix} An unexpected error occurred.`;
};

export default formatErrorMessage;
