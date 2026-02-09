# Voice Providers — Detailed Design | v1.0.0 | 2026-02-03

## Overview

ATR uses a dual-provider voice architecture: Vapi for full conversational AI and Deepgram for high-performance speech processing. This gives flexibility to use the best tool for each voice scenario.

## Provider 1: Vapi

### What It Is
Full conversational voice AI platform. Handles the entire voice interaction lifecycle — listening, understanding, responding, and managing turn-taking.

### Use Cases in ATR
- **Full voice conversations**: User talks to Resto hands-free for extended sessions
- **Voice onboarding**: Guide users through setup via voice
- **Phone calls**: Future — Resto makes calls on behalf of the business (sales, support)
- **Voice commands with complex responses**: "Walk me through today's analytics"

### Key Capabilities
- Real-time voice streaming
- Natural turn-taking (handles interruptions)
- Tool calling during voice (agent can execute actions mid-conversation)
- Multiple voice options
- Webhook integration for custom logic

### Integration Pattern
- Vapi assistant configured per tenant
- Custom system prompt includes user's business context
- Tool definitions mapped to ATR action capabilities
- Conversation transcripts stored in knowledge base

## Provider 2: Deepgram

### What It Is
High-accuracy, low-latency speech-to-text (STT) and text-to-speech (TTS) engine.

### Use Cases in ATR
- **Voice input in chat**: User records a voice message, Deepgram transcribes, Resto processes as text
- **Read-aloud**: Resto reads documents, plans, or summaries aloud
- **Transcription**: Meeting notes, voice memo processing
- **Accessibility**: Voice output for visually impaired users

### Key Capabilities
- Nova-3 model for highest accuracy STT
- Real-time streaming transcription
- Multiple language support
- Custom vocabulary/terminology
- Low latency TTS with natural voices

### Integration Pattern
- Deepgram SDK integrated in Next.js backend
- WebSocket connection for real-time streaming
- Audio processed server-side, text returned to client
- TTS audio streamed to client for playback

## When to Use Which

| Scenario | Provider | Why |
|----------|----------|-----|
| Extended voice conversation | Vapi | Full conversation management |
| Quick voice command | Deepgram STT → LLM → Deepgram TTS | Lower latency for short interactions |
| Voice message in chat | Deepgram STT | Just need transcription |
| Agent reading content aloud | Deepgram TTS | High-quality voice output |
| Phone-based interaction | Vapi | Telephony integration |
| Multi-language voice | Deepgram | Broader language support |

## Voice UX Guidelines

### Resto in Voice Mode
- Shorter, more conversational responses
- Confirm understanding before executing ("I'll deploy your app to production. Go ahead?")
- Provide audio feedback for long operations ("Working on it... this will take about 30 seconds")
- Graceful handling of ambient noise and unclear input
- Easy switching between voice and text mid-conversation

### Voice Persona Consistency
- Same personality as text Resto (friendly, professional, proactive)
- Voice selection matches persona (warm, clear, confident)
- Customizable voice option (user can choose different voice profiles)

## Cost Considerations

| Provider | Pricing Model | Estimated Cost |
|----------|--------------|---------------|
| Vapi | Per-minute of conversation | ~$0.05-0.10/min |
| Deepgram STT | Per-minute of audio | ~$0.0043/min (Nova-3) |
| Deepgram TTS | Per character | ~$0.015/1K chars |

Voice minutes tracked as part of user's usage quota. Overages consumed from credits.
