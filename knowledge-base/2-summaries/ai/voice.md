# Voice Interface | v1.0.0 | 2026-02-03

Resto supports full voice interaction — users can talk to their AI co-founder naturally, just like speaking to a human partner.

**Dual-Provider Architecture:**
- **Vapi:** Full conversational voice AI platform. Handles voice agent orchestration, turn-taking, interruptions, and complex voice workflows. Primary provider for complete voice conversations.
- **Deepgram:** High-accuracy, low-latency speech-to-text (STT) and text-to-speech (TTS). Used for transcription, voice input processing, and voice output when fine-grained control is needed.

**Use Cases:**
- Hands-free business planning sessions
- Voice commands for quick actions ("Deploy my app", "Show me today's metrics")
- Voice reviews of documents, plans, and code changes
- Mobile-first interaction while on the go

**Integration:** Voice is a first-class interaction mode, not an add-on. Everything achievable via chat is achievable via voice. The agent adapts its response style (shorter, more conversational) when in voice mode.
