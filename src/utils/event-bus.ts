const eventBus: {
  map: {[key: string]: Function[]},
  on: Function,
  off: Function,
  emit: Function,
} = {
  map: {},

  on (eventName: string, handler: Function) {
    this.map[eventName] = this.map[eventName] || []
    this.map[eventName].push(handler)
  },

  off (eventName: string, handler: Function) {
    const handlerList = this.map[eventName]
    if (!handlerList || !handlerList.length) return

    const index = handlerList.indexOf(handler)
    if (index !== -1) handlerList.splice(index, 1)
  },

  emit (eventName: string, ...args: any[]): void {
    const handlerList = this.map[eventName]
    if (!handlerList || !handlerList.length) return

    for (let i = handlerList.length - 1; i >= 0; i--) {
      handlerList[i](...args)
    }
  }
}

// TODO
export function initWorkletEventBus() {
  wx.worklet.runOnUI(() => {
    'worklet'
    // @ts-ignore
    if (!globalThis.temp) globalThis.temp = {}
    // @ts-ignore
    if (!globalThis.eventBus) {
      // const eventBus = eventBus;
      // @ts-ignore
      globalThis.eventBus = eventBus
    }
  })()
}

export default eventBus;