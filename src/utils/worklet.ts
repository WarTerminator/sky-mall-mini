/*
  Worker线程，可以创建一个独立的线程来处理耗时的计算任务，避免阻塞UI线程，提高程序的响应速度。这适用于复杂的计算逻辑，例如数据处理、图像处理等。
  * 主要是为了提升程序性能，处理耗时任务，以及优化动画和图形渲染。
- https://developers.weixin.qq.com/miniprogram/dev/api/ui/worklet/tool-function/worklet.runOnJS.html
- https://developers.weixin.qq.com/miniprogram/dev/framework/runtime/skyline/worklet.html
*/

function getShared() {
  return wx.worklet.shared;
}

function getTiming() {
  'worklet'
  return wx.worklet.timing
}

function getRunOnUI() {
  'worklet'
  return wx.worklet.runOnUI
}

function getRunOnJS() {
  'worklet'
  wx.worklet.runOnJS
}
