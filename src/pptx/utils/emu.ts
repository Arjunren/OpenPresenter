export const EMU_PER_INCH = 914400;
export const EMU_PER_CENTIMETER = 360000;
export const EMU_PER_POINT = 12700;

export function emuToPixels(emu: number): number {
  return Math.round((emu / EMU_PER_INCH) * 96);
}

export function emuToPercent(emu: number, totalEmus: number): number {
  if (totalEmus === 0) return 0;
  return (emu / totalEmus) * 100;
}
