function avg(array) {
  return array.reduce((acc, val, index, self) => {
    if (index === self.length - 1) {
      // return avg
      return (acc+val)/self.length;
    } else {
      // add current
      acc += val;
    }
    return acc;
  }, 0);
}
function sma(array, count) {
  // calculate the count-unit sma for the values in the array
  return array.reduce((acc, value, index, self) => {
    if (index + 1 < count) {
      acc.push(0);
      return acc;
    }
    // find last "count" values now that we're past the first "count"
    const values = self.slice(index + 1 - count, index + 1);
    acc.push(avg(values));
    return acc;
  }, []);
}

export {sma};
