export class ChatRoomDO {
  state: any;
  env: any;
  sessions: Map<any, { userId: string; joinedAt: number }>;
  recentCallSignals: Array<any>;

  constructor(state: any, env: any) {
    this.state = state;
    this.env = env;
    this.sessions = new Map();
    this.recentCallSignals = [];
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // 1. WebSocket Upgrade Handler
    if (url.pathname === '/websocket') {
      const upgradeHeader = request.headers.get('Upgrade');
      if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
      }

      const userId = url.searchParams.get('userId') || 'guest';
      const webSocketPair = new WebSocketPair();
      const [client, server] = Object.values(webSocketPair);

      // Accept server side of the connection
      server.accept();
      this.sessions.set(server, { userId, joinedAt: Date.now() });

      // Replay any active pending call signals if peer joined right after call initiate/offer
      const now = Date.now();
      for (const sig of this.recentCallSignals) {
        if (now - sig.timestamp < 35000 && sig.senderId !== userId) {
          try {
            server.send(JSON.stringify(sig));
          } catch {}
        }
      }

      // Notify peer that a user joined the live room
      this.broadcast(server, JSON.stringify({
        type: 'user_connected',
        userId
      }));

      server.addEventListener('message', (event: MessageEvent) => {
        try {
          const raw = typeof event.data === 'string' ? event.data : new TextDecoder().decode(event.data);
          const data = JSON.parse(raw);

          // Typing status
          if (data.type === 'typing') {
            this.broadcast(server, JSON.stringify({
              type: 'typing',
              userId: data.userId || userId,
              isTyping: Boolean(data.isTyping)
            }));
          } else if (data.type === 'ping') {
            server.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }));
          } else if (data.type === 'chat_message') {
            this.broadcast(server, JSON.stringify({
              type: 'new_message',
              message: data.message
            }));
          } else if (data.type === 'call_signal') {
            const sigObj = {
              type: 'call_signal',
              signal: data.signal,
              senderId: data.senderId || userId,
              targetUserId: data.targetUserId,
              callType: data.callType || 'audio',
              callerInfo: data.callerInfo || null,
              payload: data.payload || null,
              timestamp: Date.now()
            };
            this.recordCallSignal(sigObj);
            // Forward WebRTC Calling signals (initiate, ringing, accept, reject, ice, end)
            this.broadcast(server, JSON.stringify(sigObj));
          }
        } catch {}
      });

      const cleanup = () => {
        this.sessions.delete(server);
        this.broadcast(server, JSON.stringify({
          type: 'user_disconnected',
          userId
        }));
      };

      server.addEventListener('close', cleanup);
      server.addEventListener('error', cleanup);

      return new Response(null, {
        status: 101,
        webSocket: client
      });
    }

    // 2. HTTP Broadcast Endpoint (invoked by REST API on message / photo reveal / dua)
    if (url.pathname === '/broadcast' && request.method === 'POST') {
      try {
        const payload = await request.json();
        if (payload?.type === 'call_signal' || payload?.signal) {
          this.recordCallSignal(payload);
        }
        const payloadStr = JSON.stringify(payload);
        this.broadcastAll(payloadStr);
        return new Response(JSON.stringify({ success: true, receivers: this.sessions.size }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // 3. Call Signals Lookup (for fast HTTP polling fallback when socket connecting)
    if (url.pathname === '/call-signals') {
      const now = Date.now();
      const active = this.recentCallSignals.filter(s => now - s.timestamp < 35000);
      return new Response(JSON.stringify({
        success: true,
        signals: active
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 4. Status check endpoint
    if (url.pathname === '/status') {
      return new Response(JSON.stringify({
        activeSessions: this.sessions.size,
        users: Array.from(this.sessions.values()).map(s => s.userId)
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response('Not found', { status: 404 });
  }

  broadcast(sender: any, message: string) {
    for (const [ws] of this.sessions.entries()) {
      if (ws !== sender) {
        try {
          ws.send(message);
        } catch {
          this.sessions.delete(ws);
        }
      }
    }
  }

  broadcastAll(message: string) {
    for (const [ws] of this.sessions.entries()) {
      try {
        ws.send(message);
      } catch {
        this.sessions.delete(ws);
      }
    }
  }

  recordCallSignal(sig: any) {
    if (!sig) return;
    if (sig.signal === 'end' || sig.signal === 'reject') {
      this.recentCallSignals = [];
    } else {
      const now = Date.now();
      this.recentCallSignals = this.recentCallSignals
        .filter(s => now - s.timestamp < 35000)
        .concat({ ...sig, timestamp: sig.timestamp || now });
      if (this.recentCallSignals.length > 10) {
        this.recentCallSignals = this.recentCallSignals.slice(-10);
      }
    }
  }
}
