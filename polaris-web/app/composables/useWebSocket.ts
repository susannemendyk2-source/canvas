export const useWebSocket = () => {
  const eventSource = ref<EventSource | null>(null)
  const connected = ref(false)
  const lastMessage = ref<any>(null)

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null

  const connect = (url: string) => {
    disconnect()
    const es = new EventSource(url)
    eventSource.value = es

    es.onopen = () => { connected.value = true }

    es.onmessage = (event) => {
      try {
        lastMessage.value = JSON.parse(event.data)
      } catch {
        lastMessage.value = event.data
      }
    }

    es.onerror = () => {
      connected.value = false
      es.close()
      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = null
          connect(url)
        }, 3000)
      }
    }
  }

  const disconnect = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    connected.value = false
  }

  onUnmounted(disconnect)

  return { connected, lastMessage, connect, disconnect }
}
