## kmp

>KMP算法是一种改进的字符串匹配算法，由D.E.Knuth，J.H.Morris和V.R.Pratt提出的，因此人们称它为克努特—莫里斯—普拉特操作（简称KMP算法）。KMP算法的核心是利用匹配失败后的信息，尽量减少模式串与主串的匹配次数以达到快速匹配的目的。具体实现就是通过一个next()函数实现，函数本身包含了模式串的局部匹配信息。KMP算法的时间复杂度O(m+n)。

### 看毛片算法

在写这篇文章之前也看过很多人写的关于 KMP 的文章，但是总感觉到了对求 next (各位看官不要慌，下面会有对 next 数组的解读)数组的时候解释的总是模棱两可，不太容易看懂
所以在此，新手程序员想尝试写一写对于 KMP 算法的理解。

### 直击痛点

如果现在有一个源字符串 S `"abcdhabcdfj"` 以及子字符串 T `"abcdf"` 现在我想找到 T 在 S 中的位置，我们该如何写出相应的算法找到呢。

最简单的一种暴力回溯，逐位匹配
```
   S -> a b c d|h|a b c d f j
 1 T -> a b c d|f|   -> 第 4 位 f 匹配出错，接着 T 串需向右移动继续匹配
 2 T ->   a b c d f  -> 第 0 位 a 匹配出错，T 串向右移动，以此类推
 .
 .
 .
   T ->           a b c d f j 匹配成功
```
显而易见这样的匹配效率是很低的，于是上面的老爷子们提出了 KMP 来提升效率，从上面的匹配流程中我们可以看到，其实匹配过程 S 串是不需要做任何移动的，我们
从始至终都是在对 T 串进行移动，KMP 正是在 T 串移动上做的优化。

### 揭开 KMP 的面纱

从上帝视角我们可以观察到 abcd 这四个是匹配的，到 f 匹配失效，我们可以想一下，如果我们人为来操作的话，前四位我们肯定是不会再去进行逐一匹配的，会直接
从 f 位开始匹配，这样我们就基本找出了 KMP 最核心的地方，我们如何才能知道正确的回溯位置，也就是我们接下来要说的 next 数组，也叫作匹配表，我们需要提前
将 next 找出来，然后在进行 S 和 T 串匹配的时候，利用 next 数组拿到正确的回溯位置。

  #### 如何求出 next 数组
  
  首先我们需要引入前缀和后缀的概念，先看一个表格：
  ```
  T    a  b  a  b  c  d  a  c 
  i 0  1  2  3  4  5  6  7  8
  k -1 0  0  1  2  0  0  1  0
  ```
  在上面的表格中 i 表示下标，k 代表前缀和后缀匹配的长度，至于 k 为何从 -1 开始，这也是我对于理解 next 数组最困惑的地方，k 的初始值设为 -1，
  是表示一个不存在的值，字符串必须向右移动。
  
  接下来我们来说一下前缀和后缀：
  
  - a 只有一个字符所以直接设置匹配长度为 0
  - ab 前缀 [a]，后缀 [b] 匹配长度为 0
  - aba 前缀 [a, ab]，后缀 [ba, a] a 匹配所以长度为 1
  - abab 前缀 [a, ab, aba]，后缀 [bab, ab, b] ab 匹配，所以长度为 2
  - ababc 前缀 [a, ab, aba, abab]，后缀 [babc, abc, bc, c] 无匹配，所以长度为 0
  - ababcd 前缀 [a, ab, aba, abab, ababc]，后缀 [babcd, abcd, bcd, cd, d] 无匹配所以长度为 0
  
  然后依次类推，在这里有一个比较容易误解的地方，这里的前缀和后缀并不是回文字符串的形式，不是 abba这样的，而是 abab 这样的。
  
  接下来我们实现下 next 的获取：
  ```go
  func getNext(s string) []int {
	l := len(s) + 1 // 0 位存 -1，所以需要多存一位，以判断是否为 -1 执行 s 向右移动
	next := make([]int, l, l)
	next[0] = -1
	var (
		k = -1 // 初始值，k 为前缀和后缀匹配的长度
		i int
	)
  // 为何是 l - 1，因为已经设置初始值为 -1 了
	for i < l - 1 {
		if k == -1 || s[k] == s[i] {
			k++
			i++
			next[i] = k
		} else {
			k = next[k] // 回溯的位置
		}
	}
	return next
}
  ```
  在我们实现 next 数组的时候，我们其实已经利用了回溯的原理，来拿到正确的回溯位置，然后接下来我们就可以利用 next 来实现 kmp 了：
  ```go 
func kmp(source, target string) int {
	var (
		k = -1
		i int
	)
	next := getNext(target)
	for k < len(target) && i < len(source) {
		if k == -1 || source[i] == target[k] {
			k++
			i++
		} else {
			k = next[k]
		}
		if k == len(target) {
			return i - k
		}
	}
	return 0
}
  ```
  看到这里我们会发现其实我们利用了两次回溯的原理来获取正确的位置。
  
  新手第一次上路，有不对的地方请轻喷，也欢迎大家给我指正错误的地方。