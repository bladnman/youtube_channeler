// Suppress punycode deprecation warning from googleapis package

interface WarningData {
  name?: string;
  message?: string;
}

const originalEmit = process.emit;
process.emit = function (
  name: string | symbol,
  data: WarningData,
  ...args: any[]
): boolean {
  if (
    name === 'warning' &&
    data?.name === 'DeprecationWarning' &&
    data?.message?.includes('punycode')
  ) {
    return false;
  }
  return originalEmit.apply(process, [name, data, ...args]);
} as typeof process.emit; 