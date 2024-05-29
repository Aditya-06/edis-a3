const hasTwoDecimals = (value: number): boolean => {
  if (value <= 0) {
    return false;
  }

  // Split by decimal point and get the decimal part
  const decimalPart = value.toString().split('.')[1] || '';
  // console.log(`decimalPart.length: ${decimalPart.length}`);
  // Check if the decimal part is a valid number with length 2
  return !isNaN(Number(decimalPart)) && decimalPart.length === 2;
};

export default hasTwoDecimals;
