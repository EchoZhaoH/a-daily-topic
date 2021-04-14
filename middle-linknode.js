/**
 * 寻找链表中位节点
 * 利用快慢指针
 * @param {node} head 
 */

function findCenter(head) {
  let slower = head, faster = head;
  while(faster && faster.next != null) {
    slower = slower.next;
    faster = faster.next.next;
  }
  if (faster != null) {
    slower = slower.next;
  }
  return slower
}

console.log(findCenter({val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: null } } }}))