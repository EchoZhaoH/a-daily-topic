function quickSort(arr) {
  function loop(adjust, begin, end) {
    let left = begin, right = end;

    // 基准位
    let base = adjust[begin];
    while(left < right) {

      // 先从右边开始
      while(left < right && adjust[right] >= base) right--;
      if (left < right) {

        // 找到后填坑
        adjust[left] = adjust[right];
        left++;
      }

      // 右边找完，找左边
      while(left < right && adjust[left] < base) left++;
      if (left < right) {
        adjust[right] = adjust[left];
        right--;
      }
    }
    adjust[left] = base;
    return left;
  }
  function pecursion(adjust, begin, end) {
    if (begin < end) {
      const index = loop(adjust, begin, end);
      pecursion(adjust, begin, index - 1);
      pecursion(adjust, index + 1, end);
    }
  }
  pecursion(arr, 0, arr.length - 1)
}
const a = [3, 4, 1, 7, 2, 9, 8, 5, 6, 2, 100, 65, 1000, 98];
quickSort(a);
console.log(a)