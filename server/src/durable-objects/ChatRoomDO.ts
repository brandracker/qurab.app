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
            this.recordCallSignal(sigObj).catch(() => {});
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
        const payload: any = await request.json();
        if (payload?.type === 'call_signal' || payload?.signal) {
          await this.recordCallSignal(payload);
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
      if (this.recentCallSignals.length === 0 && this.state?.storage) {
        try {
          const saved: any = await this.state.storage.get('recent_signals');
          if (Array.isArray(saved)) {
            this.recentCallSignals = saved.filter(s => now - s.timestamp < 45000);
          }
        } catch {}
      }
      const active = this.recentCallSignals.filter(s => now - s.timestamp < 45000);
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

  async recordCallSignal(sig: any) {
    if (!sig) return;
    const now = Date.now();

    // Hydrate from storage if in-memory list is empty
    if (this.recentCallSignals.length === 0 && this.state?.storage) {
      try {
        const saved: any = await this.state.storage.get('recent_signals');
        if (Array.isArray(saved)) {
          this.recentCallSignals = saved.filter(s => now - s.timestamp < 45000);
        }
      } catch {}
    }

    if (sig.signal === 'initiate') {
      this.recentCallSignals = [{ ...sig, timestamp: sig.timestamp || now }];
    } else {
      // Keep recent signals for 45s so slow network handshakes aren't lost
      const active = this.recentCallSignals.filter(s => now - s.timestamp < 45000);
      const newEntry = { ...sig, timestamp: sig.timestamp || now };

      // Critical signals: initiate, accept, sdp_offer, sdp_answer, partner_audio_toggle, video_toggle, end
      // NEVER let a burst of ICE candidates evict critical SDP handshake signals!
      const critical = active.filter(s => s.signal !== 'ice_candidate');
      const candidates = active.filter(s => s.signal === 'ice_candidate').slice(-50);

      if (sig.signal === 'ice_candidate') {
        candidates.push(newEntry);
      } else {
        critical.push(newEntry);
      }

      this.recentCallSignals = [...critical, ...candidates.slice(-50)];
    }

    if (this.state?.storage) {
      try {
        await this.state.storage.put('recent_signals', this.recentCallSignals);
      } catch {}
    }
  }
}
