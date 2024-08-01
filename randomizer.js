// given an array with at least two elements, it returns two random indices and the elements in the array that correspond to those indices
const randomizer = (arr) => {
  let n = arr.length;
  if (n === 0) return null;

  // if there's only one item, just return the item
  if (n === 1) {
    return { isOne: true, rand_data_1: arr[0], rand_data_2: arr[0] };
  }

  let first_index = Math.floor(Math.random() * n);
  let second_index = Math.floor(Math.random() * n);

  while (first_index === second_index) {
    second_index = Math.floor(Math.random() * n);
  }

  return {
    isOne: false,
    rand_data_1: arr[first_index],
    rand_data_2: arr[second_index],
  };
};

module.exports = randomizer;
