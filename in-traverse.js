// 二叉树中序遍历

/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */

/**
 * @param {TreeNode} root
 * @return {number[]}
 */
var inorderTraversal = function (root) {
  const res = []
  function stackTraversal() {
    const stack = []
    let cur = root
    while (cur !== null || stack.length) {
      if (cur !== null) {
        stack.push(cur);
        cur = cur.left
      } else {
        if (stack.length) {
          const node = stack.pop()
          res.push(node.val)
          cur = node.right
        }
      }
    }
  }
  stackTraversal()
  return res
};