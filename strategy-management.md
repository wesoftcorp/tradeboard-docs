# Strategy RMS Engine

This page replaces the retired Strategy Management documentation. The current Strategy RMS Engine is a durable multi-leg and signal strategy system, not the older webhook-to-order-queue model.

Use these current references:

- [Strategy RMS Engine feature guide](new-features/strategy-rms-engine.md)
- [Strategy RMS RESTX API](api-documentation/v1/strategy-rms-api/README.md)
- [Public Strategy Webhook](api-documentation/v1/strategy-rms-api/webhook.md)
- [Strategy RMS Engine developer architecture](developers/design-documentation/39-strategy-module.md)

The public webhook path remains `POST /strategy/webhook/<token>`, but its message vocabulary is now strategy-kind specific: batch strategies accept `start` and `stop`; signal strategies accept `long_entry`, `long_exit`, `short_entry`, and `short_exit`. The old `BUY`/`SELL`, platform-prefix, symbol-mapping, and background-queue instructions no longer apply to this feature.
