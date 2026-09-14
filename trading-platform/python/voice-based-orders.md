# Voice Based Orders

This is an experimental feature using Tradeboard & Groq (Whisper Large V3 Model). This system allows users to place orders via voice commands. The voice commands are translated from speech to text using the OpenAI Whisper large v3 model, and then the transcription is fed to Tradeboard to execute the order.

[https://github.com/wesoftcorp/tradeboard-voice-based-orders](https://github.com/wesoftcorp/tradeboard-voice-based-orders)

**How to Use the Tradeboard Voice-Based Trading System**

1. Select the desired Exchange and Product Type from the dropdown menus.
2. Click the "Start Listening" button to begin.
3. Speak your command clearly (e.g., "Milo buy 20  TCS").
4. After a brief pause, your order will be processed automatically.
5. To stop listening, click the "Stop Listening" button.

**Supported Activation Commands:** MILO, MYLO

**Exchanges Supported:** NSE, BSE

**Product Types:** MIS (Margin Intraday Square off), CNC (Cash and Carry for equity)

**Setting up Groq and Tradeboard API keys:**

1. Go to [console.groq.com](https://console.groq.com)
2. Create an API key and copy it to your clipboard.
3. In your Tradeboard application, go to "API Key". Get your Tradeboard API Key.

**Dictionary Mapping**

To ensure that the system correctly interprets voice commands, it uses a dictionary mapping. This dictionary maps common stock names and abbreviations to their corresponding symbols.

The system automatically extracts the action, quantity, and symbol from the voice command and then places the order. In the logs, you'll find details such as the order ID, timestamp, and response data.

**Overall Assessment**

This experimental voice-based trading system offers a novel approach to order placement. Although there is room for improvement, such as enhancing the accuracy of speech-to-text transcription and refining the natural language understanding capabilities, this initiative showcases the potential of using AI technologies in the financial trading space.
