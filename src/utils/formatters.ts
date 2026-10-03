export const toBanglaDigits = (value: number | string): string => {
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return value
    .toString()
    .replace(/\d/g, (digit) => bnDigits[parseInt(digit, 10)]);
};

export const formatPrice = (
  amount: number,
  forceBanglaDigits = false
): string => {
  const formattedNumber = amount.toLocaleString('en-US');
  if (forceBanglaDigits) {
    return `৳${toBanglaDigits(formattedNumber)}`;
  }
  return `৳${formattedNumber}`;
};

export const calculateBill = (
  subtotal: number,
  tipAmount: number,
  vatRate = 0.05,
  serviceRate = 0.05
) => {
  const vatAmount = Math.round(subtotal * vatRate);
  const serviceChargeAmount = Math.round(subtotal * serviceRate);
  const grandTotal = subtotal + vatAmount + serviceChargeAmount + tipAmount;

  return {
    subtotal,
    vatRate,
    vatAmount,
    serviceChargeRate: serviceRate,
    serviceChargeAmount,
    tipAmount,
    grandTotal,
  };
};
