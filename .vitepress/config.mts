import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Tradeboard Docs",
  description: "Documentation, API Reference & Guides for Tradeboard Algo Trading Platform",
  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }]
  ],
  cleanUrls: false,
  ignoreDeadLinks: true,

    vite: {
    assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.GIF', '**/*.svg', '**/*.png', '**/*.ico'],
    resolve: {
      alias: {
        '/assets': fileURLToPath(new URL('../public/assets', import.meta.url))
      }
    }
  },

  themeConfig: {
    logo: '/tradeboard-mark.png',
    siteTitle: 'Tradeboard',

    nav: [
      { text: 'Guide', link: '/README' },
      { text: 'Voice Agent', link: '/new-features/agent/voice' },
      { text: 'Brokers', link: '/connect-brokers/brokers/' },
      { text: 'API Reference', link: '/api-documentation/v1/orders-api/placesmartorder' },
      { text: 'Crypto', link: '/crypto/exchanges/delta-exchange' },
      { text: 'GitHub', link: 'https://github.com/wesoftcorp/tradeboard-docs' }
    ],

    sidebar: [
  {
    "text": "Overview",
    "collapsed": false,
    "items": [
      {
        "text": "What is Tradeboard?",
        "link": "/"
      },
      {
        "text": "Why to Build with Tradeboard?",
        "link": "/why-to-build-with-tradeboard"
      },
      {
        "text": "Tradeboard Architecture",
        "link": "/tradeboard-architecture"
      },
      {
        "text": "Analytics and Options Tools",
        "link": "/analytics-and-options-tools"
      },
      {
        "text": "Mini FOSS Universe",
        "link": "/mini-foss-universe"
      },
      {
        "text": "Community Support",
        "link": "/community-support"
      },
      {
        "text": "Tradeboard GPT",
        "link": "/tradeboard-gpt"
      },
      {
        "text": "New Features",
        "link": "/new-features/",
        "items": [
          {
            "text": "Agent",
            "link": "/new-features/agent/",
            "items": [
              {
                "text": "What the Agent Can Do",
                "link": "/new-features/agent/capabilities"
              },
              {
                "text": "Agent Configuration",
                "link": "/new-features/agent/configuration"
              },
              {
                "text": "Voice Agent",
                "link": "/new-features/agent/voice"
              },
              {
                "text": "ChatGPT Subscription",
                "link": "/new-features/agent/chatgpt-subscription"
              },
              {
                "text": "Agent by Example",
                "link": "/new-features/agent/examples"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Portfolio Backtester and Analyzer",
            "link": "/new-features/portfolio-analytics"
          },
          {
            "text": "Chart Trading Terminal",
            "link": "/new-features/trading-terminal"
          },
          {
            "text": "Scalping Terminal",
            "link": "/new-features/fast-scalper"
          },
          {
            "text": "Python Strategy Hosting",
            "link": "/new-features/python-strategy-hosting"
          },
          {
            "text": "Flow - Visual Strategy Builder",
            "link": "/new-features/flow-visual-strategy-builder"
          },
          {
            "text": "Historify",
            "link": "/new-features/historify"
          },
          {
            "text": "API Analyzer",
            "link": "/new-features/api-analyzer"
          },
          {
            "text": "PNL Tracker",
            "link": "/new-features/pnl-tracker"
          },
          {
            "text": "Traffic/Latency Monitor",
            "link": "/new-features/traffic-latency-monitor"
          },
          {
            "text": "Chartink Integration",
            "link": "/new-features/chartink-integration"
          },
          {
            "text": "Action Center",
            "link": "/new-features/action-center"
          },
          {
            "text": "Strategy RMS Engine",
            "link": "/new-features/strategy-rms-engine"
          },
          {
            "text": "Calendar Ledger (Sandbox)",
            "link": "/new-features/calendar-ledger"
          }
        ],
        "collapsed": true
      },
      {
        "text": "Responsibilities",
        "link": "/responsibilities"
      },
      {
        "text": "Compliance",
        "link": "/compliance"
      },
      {
        "text": "Contributors",
        "link": "/contributors"
      },
      {
        "text": "Monetization",
        "link": "/monetization"
      }
    ]
  },
  {
    "text": "Connect Brokers",
    "collapsed": true,
    "items": [
      {
        "text": "Brokers",
        "link": "/connect-brokers/brokers/",
        "items": [
          {
            "text": "5Paisa",
            "link": "/connect-brokers/brokers/5paisa"
          },
          {
            "text": "5paisa (XTS)",
            "link": "/connect-brokers/brokers/5paisa-xts"
          },
          {
            "text": "AliceBlue",
            "link": "/connect-brokers/brokers/aliceblue"
          },
          {
            "text": "AngelOne",
            "link": "/connect-brokers/brokers/angelone"
          },
          {
            "text": "Arrow",
            "link": "/connect-brokers/brokers/arrow"
          },
          {
            "text": "Compositedge",
            "link": "/connect-brokers/brokers/compositedge"
          },
          {
            "text": "Definedge",
            "link": "/connect-brokers/brokers/definedge"
          },
          {
            "text": "Dhan",
            "link": "/connect-brokers/brokers/dhan"
          },
          {
            "text": "Dhan(Sandbox)",
            "link": "/connect-brokers/brokers/dhan-sandbox"
          },
          {
            "text": "Firstock",
            "link": "/connect-brokers/brokers/firstock"
          },
          {
            "text": "FlatTrade",
            "link": "/connect-brokers/brokers/flattrade"
          },
          {
            "text": "Fyers",
            "link": "/connect-brokers/brokers/fyers"
          },
          {
            "text": "Groww",
            "link": "/connect-brokers/brokers/groww"
          },
          {
            "text": "HDFC Sky",
            "link": "/connect-brokers/brokers/hdfc-sky"
          },
          {
            "text": "HDFC Securities",
            "link": "/connect-brokers/brokers/hdfc-securities"
          },
          {
            "text": "IIFL (XTS)",
            "link": "/connect-brokers/brokers/iifl-xts"
          },
          {
            "text": "IIFL Capital",
            "link": "/connect-brokers/brokers/iifl-capital"
          },
          {
            "text": "IndMoney (INDstocks)",
            "link": "/connect-brokers/brokers/indmoney"
          },
          {
            "text": "IndiaBulls Securities",
            "link": "/connect-brokers/brokers/indiabulls-securities"
          },
          {
            "text": "JainamXTS",
            "link": "/connect-brokers/brokers/jainamxts"
          },
          {
            "text": "Kotak Securities",
            "link": "/connect-brokers/brokers/kotak-securities"
          },
          {
            "text": "Motilal Oswal",
            "link": "/connect-brokers/brokers/motilal-oswal"
          },
          {
            "text": "Mstock",
            "link": "/connect-brokers/brokers/mstock"
          },
          {
            "text": "Nubra",
            "link": "/connect-brokers/brokers/nubra"
          },
          {
            "text": "Paytm",
            "link": "/connect-brokers/brokers/paytm"
          },
          {
            "text": "Pocketful",
            "link": "/connect-brokers/brokers/pocketful"
          },
          {
            "text": "Samco",
            "link": "/connect-brokers/brokers/samco"
          },
          {
            "text": "Shoonya",
            "link": "/connect-brokers/brokers/shoonya"
          },
          {
            "text": "RMoney (XTS)",
            "link": "/connect-brokers/brokers/rmoney"
          },
          {
            "text": "Tradejini",
            "link": "/connect-brokers/brokers/tradejini"
          },
          {
            "text": "TradeSmart",
            "link": "/connect-brokers/brokers/tradesmart"
          },
          {
            "text": "Upstox",
            "link": "/connect-brokers/brokers/upstox"
          },
          {
            "text": "Wisdom Capital",
            "link": "/connect-brokers/brokers/wisdom-capital"
          },
          {
            "text": "Zebu",
            "link": "/connect-brokers/brokers/zebu"
          },
          {
            "text": "Zerodha",
            "link": "/connect-brokers/brokers/zerodha"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "text": "Crypto",
    "collapsed": true,
    "items": [
      {
        "text": "Exchanges",
        "link": "/crypto/exchanges/",
        "items": [
          {
            "text": "Delta Exchange",
            "link": "/crypto/exchanges/delta-exchange"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "text": "Installation Guidelines",
    "collapsed": true,
    "items": [
      {
        "text": "Getting Started",
        "link": "/getting-started/",
        "items": [
          {
            "text": "Windows Installation",
            "link": "/getting-started/windows-installation/",
            "items": [
              {
                "text": "Pre-Requesites",
                "link": "/getting-started/windows-installation/pre-requesites"
              },
              {
                "text": "Setup",
                "link": "/getting-started/windows-installation/setup"
              },
              {
                "text": "Install Dependencies",
                "link": "/getting-started/windows-installation/install-dependencies"
              },
              {
                "text": "Ngrok Config",
                "link": "/getting-started/windows-installation/ngrok-config"
              },
              {
                "text": "Environmental Variables",
                "link": "/getting-started/windows-installation/environmental-variables"
              },
              {
                "text": "Start Tradeboard",
                "link": "/getting-started/windows-installation/start-tradeboard"
              },
              {
                "text": "SSL Verification Failed",
                "link": "/getting-started/windows-installation/ssl-verification-failed"
              },
              {
                "text": "Accessing Tradeboard",
                "link": "/getting-started/windows-installation/accessing-tradeboard"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Windows Server Installation",
            "link": "/getting-started/windows-server-installation"
          },
          {
            "text": "Windows with Caddy",
            "link": "/installation-guidelines/getting-started/windows-with-caddy"
          },
          {
            "text": "Mac OS Installation",
            "link": "/getting-started/mac-os-installation/",
            "items": [
              {
                "text": "Pre-Requesties",
                "link": "/getting-started/mac-os-installation/pre-requesties"
              },
              {
                "text": "Setup",
                "link": "/getting-started/mac-os-installation/setup"
              },
              {
                "text": "Install Dependencies",
                "link": "/getting-started/mac-os-installation/install-dependencies"
              },
              {
                "text": "Ngrok Config",
                "link": "/getting-started/mac-os-installation/ngrok-config"
              },
              {
                "text": "Environmental Variables",
                "link": "/getting-started/mac-os-installation/environmental-variables"
              },
              {
                "text": "Start Tradeboard",
                "link": "/getting-started/mac-os-installation/start-tradeboard"
              },
              {
                "text": "Install certifi",
                "link": "/getting-started/mac-os-installation/install-certifi"
              },
              {
                "text": "Accessing Tradeboard",
                "link": "/getting-started/mac-os-installation/accessing-tradeboard"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Amazon Elastic Beanstalk",
            "link": "/getting-started/amazon-elastic-beanstalk"
          },
          {
            "text": "BellGlobal",
            "link": "/installation-guidelines/getting-started/bellglobal"
          },
          {
            "text": "HouseOfFoss",
            "link": "/installation-guidelines/getting-started/houseoffoss"
          },
          {
            "text": "Ubuntu (No Custom Domain)",
            "link": "/getting-started/ubuntu-no-custom-domain"
          },
          {
            "text": "Ubuntu Server Installation",
            "link": "/getting-started/ubuntu-server-installation"
          },
          {
            "text": "Docker + Custom Domain",
            "link": "/installation-guidelines/getting-started/docker-+-custom-domain"
          },
          {
            "text": "Docker Development",
            "link": "/getting-started/docker-development"
          },
          {
            "text": "Devtunnels",
            "link": "/installation-guidelines/getting-started/devtunnels"
          },
          {
            "text": "Cloudflared with Custom Domain",
            "link": "/installation-guidelines/getting-started/cloudflared-with-custom-domain"
          },
          {
            "text": "Raspberry Pi",
            "link": "/installation-guidelines/getting-started/raspberry-pi"
          },
          {
            "text": "Testing Tradeboard in Cloud",
            "link": "/getting-started/testing-tradeboard-in-cloud"
          },
          {
            "text": "SMTP Settings",
            "link": "/getting-started/smtp-settings"
          },
          {
            "text": "TOTP Configuration",
            "link": "/getting-started/totp-configuration"
          },
          {
            "text": "Forgot Password",
            "link": "/getting-started/forgot-password"
          },
          {
            "text": "Upgrade",
            "link": "/getting-started/upgrade"
          },
          {
            "text": "Migrating to gthread (Experimental)",
            "link": "/getting-started/gthread-migration"
          }
        ],
        "collapsed": true
      },
      {
        "text": "Static IP",
        "link": "/static-ip"
      },
      {
        "text": "Latency",
        "link": "/latency"
      },
      {
        "text": "Themes",
        "link": "/installation-guidelines/themes"
      }
    ]
  },
  {
    "text": "API Documentation",
    "collapsed": true,
    "items": [
      {
        "text": "V1",
        "link": "/api-documentation/v1/",
        "items": [
          {
            "text": "Accounts API",
            "link": "/api-documentation/v1/accounts-api/",
            "items": [
              {
                "text": "Ping",
                "link": "/api-documentation/v1/accounts-api/ping"
              },
              {
                "text": "Funds",
                "link": "/api-documentation/v1/accounts-api/funds"
              },
              {
                "text": "Margin",
                "link": "/api-documentation/v1/accounts-api/margin"
              },
              {
                "text": "Orderbook",
                "link": "/api-documentation/v1/accounts-api/orderbook"
              },
              {
                "text": "Tradebook",
                "link": "/api-documentation/v1/accounts-api/tradebook"
              },
              {
                "text": "PositionBook",
                "link": "/api-documentation/v1/accounts-api/positionbook"
              },
              {
                "text": "Holdings",
                "link": "/api-documentation/v1/accounts-api/holdings"
              },
              {
                "text": "Analyzer Status",
                "link": "/api-documentation/v1/accounts-api/analyzer-status"
              },
              {
                "text": "Analyzer Toggle",
                "link": "/api-documentation/v1/accounts-api/analyzer-toggle"
              },
              {
                "text": "P\\&L by Symbol",
                "link": "/api-documentation/v1/accounts-api/pnl-symbols"
              },
              {
                "text": "Chart Preferences",
                "link": "/api-documentation/v1/accounts-api/chart-preferences"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Orders API",
            "link": "/api-documentation/v1/orders-api/",
            "items": [
              {
                "text": "Placeorder",
                "link": "/api-documentation/v1/orders-api/placeorder"
              },
              {
                "text": "PlaceSmartOrder",
                "link": "/api-documentation/v1/orders-api/placesmartorder"
              },
              {
                "text": "PlaceGttOrder",
                "link": "/api-documentation/v1/orders-api/placegttorder"
              },
              {
                "text": "GttOrderBook",
                "link": "/api-documentation/v1/orders-api/gttorderbook"
              },
              {
                "text": "OptionsOrder",
                "link": "/api-documentation/v1/orders-api/optionsorder"
              },
              {
                "text": "OptionsMultiOrder",
                "link": "/api-documentation/v1/orders-api/optionsmultiorder"
              },
              {
                "text": "BasketOrder",
                "link": "/api-documentation/v1/orders-api/basketorder"
              },
              {
                "text": "SplitOrder",
                "link": "/api-documentation/v1/orders-api/splitorder"
              },
              {
                "text": "ModifyOrder",
                "link": "/api-documentation/v1/orders-api/modifyorder"
              },
              {
                "text": "ModifyGttOrder",
                "link": "/api-documentation/v1/orders-api/modifygttorder"
              },
              {
                "text": "CancelOrder",
                "link": "/api-documentation/v1/orders-api/cancelorder"
              },
              {
                "text": "CancelGttOrder",
                "link": "/api-documentation/v1/orders-api/cancelgttorder"
              },
              {
                "text": "CancelAllOrder",
                "link": "/api-documentation/v1/orders-api/cancelallorder"
              },
              {
                "text": "ClosePosition",
                "link": "/api-documentation/v1/orders-api/closeposition"
              },
              {
                "text": "OrderStatus",
                "link": "/api-documentation/v1/orders-api/orderstatus"
              },
              {
                "text": "OpenPosition",
                "link": "/api-documentation/v1/orders-api/openposition"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Data API",
            "link": "/api-documentation/v1/data-api/",
            "items": [
              {
                "text": "Quotes",
                "link": "/api-documentation/v1/data-api/quotes"
              },
              {
                "text": "MultiQuotes",
                "link": "/api-documentation/v1/data-api/multiquotes"
              },
              {
                "text": "Depth",
                "link": "/api-documentation/v1/data-api/depth"
              },
              {
                "text": "History",
                "link": "/api-documentation/v1/data-api/history"
              },
              {
                "text": "Intervals",
                "link": "/api-documentation/v1/data-api/intervals"
              },
              {
                "text": "Symbol",
                "link": "/api-documentation/v1/data-api/symbol"
              },
              {
                "text": "Search",
                "link": "/api-documentation/v1/data-api/search"
              },
              {
                "text": "SyntheticFuture",
                "link": "/api-documentation/v1/data-api/syntheticfuture"
              },
              {
                "text": "Expiry",
                "link": "/api-documentation/v1/data-api/expiry"
              },
              {
                "text": "OptionSymbol",
                "link": "/api-documentation/v1/data-api/optionsymbol"
              },
              {
                "text": "Option Chain",
                "link": "/api-documentation/v1/data-api/option-chain"
              },
              {
                "text": "OptionGreeks",
                "link": "/api-documentation/v1/data-api/optiongreeks"
              },
              {
                "text": "MultiOptionGreeks",
                "link": "/api-documentation/v1/data-api/multioptiongreeks"
              },
              {
                "text": "Ticker",
                "link": "/api-documentation/v1/data-api/ticker"
              },
              {
                "text": "Instruments",
                "link": "/api-documentation/v1/data-api/instruments"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Utilities API",
            "link": "/api-documentation/v1/utilities-api/",
            "items": [
              {
                "text": "Holidays",
                "link": "/api-documentation/v1/utilities-api/holidays"
              },
              {
                "text": "Timings",
                "link": "/api-documentation/v1/utilities-api/timings"
              },
              {
                "text": "Telegram",
                "link": "/api-documentation/v1/utilities-api/telegram"
              },
              {
                "text": "WhatsApp",
                "link": "/api-documentation/v1/utilities-api/whatsapp"
              },
              {
                "text": "SIP Backtest",
                "link": "/api-documentation/v1/utilities-api/sip-backtest"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Portfolio API",
            "link": "/api-documentation/v1/portfolio"
          },
          {
            "text": "Strategy RMS API",
            "link": "/api-documentation/v1/strategy-rms-api/",
            "items": [
              {
                "text": "List Strategies",
                "link": "/api-documentation/v1/strategy-rms-api/list"
              },
              {
                "text": "Strategy Status",
                "link": "/api-documentation/v1/strategy-rms-api/status"
              },
              {
                "text": "Start Run",
                "link": "/api-documentation/v1/strategy-rms-api/start"
              },
              {
                "text": "Stop Run",
                "link": "/api-documentation/v1/strategy-rms-api/stop"
              },
              {
                "text": "Close All Legs",
                "link": "/api-documentation/v1/strategy-rms-api/close-all"
              },
              {
                "text": "Close One Leg",
                "link": "/api-documentation/v1/strategy-rms-api/close-leg"
              },
              {
                "text": "Run History",
                "link": "/api-documentation/v1/strategy-rms-api/runs"
              },
              {
                "text": "Order History",
                "link": "/api-documentation/v1/strategy-rms-api/orders"
              },
              {
                "text": "Risk Event Audit Trail",
                "link": "/api-documentation/v1/strategy-rms-api/events"
              },
              {
                "text": "Public Strategy Webhook (outside V1)",
                "link": "/api-documentation/v1/strategy-rms-api/webhook"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Websockets",
            "link": "/api-documentation/v1/websockets"
          },
          {
            "text": "Order Constants",
            "link": "/api-documentation/v1/order-constants"
          },
          {
            "text": "HTTP Status Codes",
            "link": "/api-documentation/v1/http-status-codes"
          },
          {
            "text": "Rate Limiting",
            "link": "/api-documentation/v1/rate-limiting"
          },
          {
            "text": "API Collections",
            "link": "/api-documentation/v1/api-collections"
          }
        ],
        "collapsed": true
      },
      {
        "text": "Playground",
        "link": "/playground"
      },
      {
        "text": "Symbol Format",
        "link": "/symbol-format"
      },
      {
        "text": "Skills",
        "link": "/skills/",
        "items": [
          {
            "text": "Execution",
            "link": "/skills/execution"
          },
          {
            "text": "Indicators",
            "link": "/skills/indicators"
          },
          {
            "text": "Backtesting",
            "link": "/skills/backtesting"
          }
        ],
        "collapsed": true
      },
      {
        "text": "MCP",
        "link": "/mcp/",
        "items": [
          {
            "text": "Remote MCP",
            "link": "/mcp/remote-mcp"
          },
          {
            "text": "Tool References",
            "link": "/mcp/tool-references"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "text": "Flow Editor",
    "collapsed": true,
    "items": [
      {
        "text": "Flow Editor",
        "link": "/flow-editor/",
        "items": [
          {
            "text": "Concepts and Execution Model",
            "link": "/flow-editor/concepts"
          },
          {
            "text": "Node Reference",
            "link": "/flow-editor/node-reference"
          },
          {
            "text": "Workflow JSON Format",
            "link": "/flow-editor/json-format"
          },
          {
            "text": "Market Data and Timeframes",
            "link": "/flow-editor/market-data"
          },
          {
            "text": "Indicators",
            "link": "/flow-editor/indicators"
          },
          {
            "text": "Tutorials",
            "link": "/flow-editor/tutorials"
          },
          {
            "text": "Limitations and Gotchas",
            "link": "/flow-editor/limitations"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "text": "Trading Platform",
    "collapsed": true,
    "items": [
      {
        "text": "Amibroker",
        "link": "/trading-platform/amibroker/",
        "items": [
          {
            "text": "Amibroker Plugin",
            "link": "/trading-platform/amibroker/amibroker-plugin"
          },
          {
            "text": "AmiQuotes",
            "link": "/trading-platform/amibroker/amiquotes"
          },
          {
            "text": "Button Trading Module (Old)",
            "link": "/trading-platform/amibroker/button-trading-module-old"
          },
          {
            "text": "Button Trading Module (Modern)",
            "link": "/trading-platform/amibroker/button-trading-module-modern"
          },
          {
            "text": "Button Trading with Split Orders",
            "link": "/trading-platform/amibroker/button-trading-with-split-orders"
          },
          {
            "text": "Button Trading with Spit Order (Options)",
            "link": "/trading-platform/amibroker/button-trading-with-spit-order-options"
          },
          {
            "text": "Button Trading with Stoploss",
            "link": "/trading-platform/amibroker/button-trading-with-stoploss"
          },
          {
            "text": "SmartOrder Chart Module",
            "link": "/trading-platform/amibroker/smartorder-chart-module"
          },
          {
            "text": "Trailing Stoploss Execution Module",
            "link": "/trading-platform/amibroker/trailing-stoploss-execution-module"
          },
          {
            "text": "Line Trading Module",
            "link": "/trading-platform/amibroker/line-trading-module"
          },
          {
            "text": "Equity Exploration Module",
            "link": "/trading-platform/amibroker/equity-exploration-module"
          },
          {
            "text": "CSV Exploration Module",
            "link": "/trading-platform/amibroker/csv-exploration-module"
          },
          {
            "text": "Options Button Trading Module",
            "link": "/trading-platform/amibroker/options-button-trading-module"
          },
          {
            "text": "Spot/Futures to Options Module (Single Leg)",
            "link": "/trading-platform/amibroker/spot-futures-to-options-module-single-leg"
          },
          {
            "text": "Spot/Futures to Options Module (Two Leg)",
            "link": "/trading-platform/amibroker/spot-futures-to-options-module-two-leg"
          },
          {
            "text": "Time Based Execution",
            "link": "/trading-platform/amibroker/time-based-execution"
          },
          {
            "text": "Limit Order Execution",
            "link": "/trading-platform/amibroker/limit-order-execution"
          },
          {
            "text": "Telegram EOD Alert",
            "link": "/trading-platform/amibroker/telegram-eod-alert"
          }
        ],
        "collapsed": true
      },
      {
        "text": "Tradingview",
        "link": "/trading-platform/tradingview",
        "items": [
          {
            "text": "Futures to Options Module",
            "link": "/trading-platform/tradingview/futures-to-options-module"
          }
        ],
        "collapsed": true
      },
      {
        "text": "GoCharting",
        "link": "/trading-platform/gocharting"
      },
      {
        "text": "ChartInk",
        "link": "/trading-platform/chartink"
      },
      {
        "text": "Python",
        "link": "/trading-platform/python/",
        "items": [
          {
            "text": "Websockets (Verbose Control)",
            "link": "/trading-platform/python/websockets-verbose-control"
          },
          {
            "text": "Order Updates (Real-Time)",
            "link": "/trading-platform/python/order-updates"
          },
          {
            "text": "Indicators",
            "link": "/trading-platform/python/indicators/",
            "items": [
              {
                "text": "Trend",
                "link": "/trading-platform/python/indicators/trend"
              },
              {
                "text": "Momentum",
                "link": "/trading-platform/python/indicators/momentum"
              },
              {
                "text": "Volatility",
                "link": "/trading-platform/python/indicators/volatility"
              },
              {
                "text": "Volume",
                "link": "/trading-platform/python/indicators/volume"
              },
              {
                "text": "Statistical",
                "link": "/trading-platform/python/indicators/statistical"
              },
              {
                "text": "Hybrid",
                "link": "/trading-platform/python/indicators/hybrid"
              },
              {
                "text": "Utility",
                "link": "/trading-platform/python/indicators/utility"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Visualization",
            "link": "/trading-platform/python/visualization/",
            "items": [
              {
                "text": "Correlation Heatmap",
                "link": "/trading-platform/python/visualization/correlation-heatmap"
              },
              {
                "text": "NIFTY Open Interest",
                "link": "/trading-platform/python/visualization/nifty-open-interest"
              },
              {
                "text": "Nifty OI Profile",
                "link": "/trading-platform/python/visualization/nifty-oi-profile"
              }
            ],
            "collapsed": true
          },
          {
            "text": "Strategy RMS From Python",
            "link": "/trading-platform/python/strategy-management"
          },
          {
            "text": "EMA Crossover Strategy",
            "link": "/trading-platform/python/ema-crossover-strategy"
          },
          {
            "text": "EMA Crossover Strategy with Stoploss and Target",
            "link": "/trading-platform/python/ema-crossover-strategy-with-stoploss-and-target"
          },
          {
            "text": "Supertrend Strategy",
            "link": "/trading-platform/python/supertrend-strategy"
          },
          {
            "text": "Supertrend Strategy with yfinance data",
            "link": "/trading-platform/python/supertrend-strategy-with-yfinance-data"
          },
          {
            "text": "Intraday Rolling Straddles",
            "link": "/trading-platform/python/intraday-rolling-straddles"
          },
          {
            "text": "Option Chain",
            "link": "/trading-platform/python/option-chain"
          },
          {
            "text": "Voice Based Orders",
            "link": "/trading-platform/python/voice-based-orders"
          }
        ],
        "collapsed": true
      },
      {
        "text": "NodeJS",
        "link": "/trading-platform/nodejs"
      },
      {
        "text": "GO",
        "link": "/trading-platform/go"
      },
      {
        "text": "RUST",
        "link": "/trading-platform/rust"
      },
      {
        "text": ".NET",
        "link": "/trading-platform/dotnet"
      },
      {
        "text": "Java",
        "link": "/trading-platform/java"
      },
      {
        "text": "Metatrader 5",
        "link": "/trading-platform/metatrader-5/",
        "items": [
          {
            "text": "Download & Install Library",
            "link": "/trading-platform/metatrader-5/download-and-install-library"
          },
          {
            "text": "Tradeboard MQL5 Functions",
            "link": "/trading-platform/metatrader-5/tradeboard-mql5-functions"
          },
          {
            "text": "Include the Header File",
            "link": "/trading-platform/metatrader-5/include-the-header-file"
          },
          {
            "text": "Sample Expert Advisor",
            "link": "/trading-platform/metatrader-5/sample-expert-advisor"
          }
        ],
        "collapsed": true
      },
      {
        "text": "Excel",
        "link": "/trading-platform/excel"
      },
      {
        "text": "Google Spreadsheets",
        "link": "/trading-platform/google-spreadsheets"
      },
      {
        "text": "N8N",
        "link": "/trading-platform/n8n"
      },
      {
        "text": "Telegram",
        "link": "/trading-platform/telegram"
      },
      {
        "text": "Whatsapp",
        "link": "/trading-platform/whatsapp"
      },
      {
        "text": "Chrome Extension",
        "link": "/trading-platform/chrome-extension"
      },
      {
        "text": "Mobile App",
        "link": "/trading-platform/mobile-app"
      },
      {
        "text": "Strategy RMS Engine",
        "link": "/strategy-management"
      }
    ]
  },
  {
    "text": "Developers",
    "collapsed": true,
    "items": [
      {
        "text": "Design Documentation",
        "link": "/developers/design-documentation/",
        "items": [
          {
            "text": "00 - Directory Structure",
            "link": "/developers/design-documentation/00-directory-structure"
          },
          {
            "text": "01 - Frontend Architecture",
            "link": "/developers/design-documentation/architecture"
          },
          {
            "text": "02 - Backend Architecture",
            "link": "/developers/design-documentation/02-backend-architecture"
          },
          {
            "text": "03 - Login and Broker Login Flow",
            "link": "/developers/design-documentation/api-layer"
          },
          {
            "text": "04 - Cache Architecture",
            "link": "/developers/design-documentation/broker-integerations"
          },
          {
            "text": "05 - Security Architecture",
            "link": "/developers/design-documentation/database-layer"
          },
          {
            "text": "06 - WebSockets Architecture",
            "link": "/developers/design-documentation/authentication-platforms"
          },
          {
            "text": "07 - Sandbox Architecture (Analyzer Mode)",
            "link": "/developers/design-documentation/configuration"
          },
          {
            "text": "08 - Historify",
            "link": "/developers/design-documentation/utilities"
          },
          {
            "text": "09 - REST API Documentation",
            "link": "/developers/design-documentation/broker-integration-checklist"
          },
          {
            "text": "10 - Flow Architecture",
            "link": "/developers/design-documentation/10-flow-architecture"
          },
          {
            "text": "11 - Docker Configuration",
            "link": "/developers/design-documentation/11-docker-configuration"
          },
          {
            "text": "12 - Ubuntu Server Installation",
            "link": "/developers/design-documentation/12-ubuntu-server-installation"
          },
          {
            "text": "13 - Chartink Architecture",
            "link": "/developers/design-documentation/13-chartink-architecture"
          },
          {
            "text": "14 - TradingView & GoCharting",
            "link": "/developers/design-documentation/14-tradingview-and-gocharting"
          },
          {
            "text": "15 - Basic UI Elements",
            "link": "/developers/design-documentation/15-basic-ui-elements"
          },
          {
            "text": "16 - Centralized Logging",
            "link": "/developers/design-documentation/16-centralized-logging"
          },
          {
            "text": "17 - Connection Pooling",
            "link": "/developers/design-documentation/17-connection-pooling"
          },
          {
            "text": "18 - Database Structure",
            "link": "/developers/design-documentation/18-database-structure"
          },
          {
            "text": "19 - PlaceOrder Call Flow",
            "link": "/developers/design-documentation/19-placeorder-call-flow"
          },
          {
            "text": "20 - Design Principles",
            "link": "/developers/design-documentation/20-design-principles"
          },
          {
            "text": "21 - Admin Section",
            "link": "/developers/design-documentation/21-admin-section"
          },
          {
            "text": "22 - Log Section",
            "link": "/developers/design-documentation/22-log-section"
          },
          {
            "text": "23 - IP Security",
            "link": "/developers/design-documentation/23-ip-security"
          },
          {
            "text": "24 - Browser Security",
            "link": "/developers/design-documentation/24-browser-security"
          },
          {
            "text": "25 - Latency Monitor",
            "link": "/developers/design-documentation/25-latency-monitor"
          },
          {
            "text": "26 - Traffic Logs",
            "link": "/developers/design-documentation/26-traffic-logs"
          },
          {
            "text": "27 - Service Layer",
            "link": "/developers/design-documentation/27-service-layer"
          },
          {
            "text": "28 - Environment Configuration",
            "link": "/developers/design-documentation/28-environment-configuration"
          },
          {
            "text": "29 - Ngrok Configuration",
            "link": "/developers/design-documentation/29-ngrok-configuration"
          },
          {
            "text": "30 - Upgrade Procedure",
            "link": "/developers/design-documentation/30-upgrade-procedure"
          },
          {
            "text": "31 - Utils Functionalities",
            "link": "/developers/design-documentation/31-utils-functionalities"
          },
          {
            "text": "32 - Master Contract Download",
            "link": "/developers/design-documentation/32-master-contract-download"
          },
          {
            "text": "33 - Broker Folder Explanations",
            "link": "/developers/design-documentation/33-broker-folder-explanations"
          },
          {
            "text": "34 - App Startup",
            "link": "/developers/design-documentation/34-app-startup"
          },
          {
            "text": "35 - Development & Testing Guide",
            "link": "/developers/design-documentation/35-development-and-testing-guide"
          },
          {
            "text": "36 - Rate Limiting Guide",
            "link": "/developers/design-documentation/36-rate-limiting-guide"
          },
          {
            "text": "37 - API Key & Playground",
            "link": "/developers/design-documentation/37-api-key-and-playground"
          },
          {
            "text": "38 - Python Strategies Hosting",
            "link": "/developers/design-documentation/38-python-strategies-hosting"
          },
          {
            "text": "39 - Strategy RMS Engine",
            "link": "/developers/design-documentation/39-strategy-module"
          },
          {
            "text": "40 - Logout & Session Expiry",
            "link": "/developers/design-documentation/40-logout-and-session-expiry"
          },
          {
            "text": "41 - MCP Architecture",
            "link": "/developers/design-documentation/41-mcp-architecture"
          },
          {
            "text": "42 - Action Center",
            "link": "/developers/design-documentation/42-action-center"
          },
          {
            "text": "43 - Telegram Bot Configuration",
            "link": "/developers/design-documentation/43-telegram-bot-configuration"
          },
          {
            "text": "44 - Toast Notifications System",
            "link": "/developers/design-documentation/44-toast-notifications-system"
          },
          {
            "text": "44 - PnL Tracker",
            "link": "/developers/design-documentation/44-pnl-tracker"
          },
          {
            "text": "46 - Search",
            "link": "/developers/design-documentation/46-search"
          },
          {
            "text": "47 - SMTP Configuration",
            "link": "/developers/design-documentation/47-smtp-configuration"
          },
          {
            "text": "48 - Password Reset",
            "link": "/developers/design-documentation/48-password-reset"
          },
          {
            "text": "49 - Themes",
            "link": "/developers/design-documentation/49-themes"
          },
          {
            "text": "50 - TOTP Configuration",
            "link": "/developers/design-documentation/50-totp-configuration"
          },
          {
            "text": "51 - Broker and System Config",
            "link": "/developers/design-documentation/51-broker-and-system-config"
          },
          {
            "text": "52 - Broker Factory Implementation",
            "link": "/developers/design-documentation/52-broker-factory-implementation"
          },
          {
            "text": "53 - Event Bus",
            "link": "/developers/design-documentation/53-event-bus"
          },
          {
            "text": "54 - Scalping Terminal",
            "link": "/developers/design-documentation/54-scalping-terminal"
          },
          {
            "text": "55 - Portfolio Analytics",
            "link": "/developers/design-documentation/55-portfolio-analytics"
          }
        ],
        "collapsed": true
      }
    ]
  },
  {
    "text": "Security",
    "collapsed": true,
    "items": [
      {
        "text": "Architecture",
        "link": "/security/architecture"
      },
      {
        "text": "Ban IP",
        "link": "/security/ban-ip"
      },
      {
        "text": "Practices",
        "link": "/security/practices"
      }
    ]
  },
  {
    "text": "Change Log",
    "collapsed": true,
    "items": [
      {
        "text": "release",
        "link": "/change-log/release/",
        "items": [
          {
            "text": "Version 2.0.2.5 Released",
            "link": "/change-log/release/version-2.0.2.5-released"
          },
          {
            "text": "Version 2.0.2.4 Released",
            "link": "/change-log/release/version-2.0.2.4-released"
          },
          {
            "text": "Version 2.0.2.3 Released",
            "link": "/change-log/release/version-2.0.2.3-released"
          },
          {
            "text": "Version 2.0.2.2 Released",
            "link": "/change-log/release/version-2.0.2.2-released"
          },
          {
            "text": "Version 2.0.2.1 Released",
            "link": "/change-log/release/version-2.0.2.1-released"
          },
          {
            "text": "Version 2.0.2.0 Released",
            "link": "/change-log/release/version-2.0.2.0-released"
          },
          {
            "text": "Version 2.0.1.9 Released",
            "link": "/change-log/release/version-2.0.1.9-released"
          },
          {
            "text": "Version 2.0.1.8 Released",
            "link": "/change-log/release/version-2.0.1.8-released"
          },
          {
            "text": "Version 2.0.1.7 Released",
            "link": "/change-log/release/version-2.0.1.7-released"
          },
          {
            "text": "Version 2.0.1.6 Released",
            "link": "/change-log/release/version-2.0.1.6-released"
          },
          {
            "text": "Version 2.0.1.5 Released",
            "link": "/change-log/release/version-2.0.1.5-released"
          },
          {
            "text": "Version 2.0.1.4 Released",
            "link": "/change-log/release/version-2.0.1.4-released"
          },
          {
            "text": "Version 2.0.1.3 Released",
            "link": "/change-log/release/version-2.0.1.3-released"
          },
          {
            "text": "Version 2.0.1.2 Released",
            "link": "/change-log/release/version-2.0.1.2-released"
          },
          {
            "text": "Version 2.0.1.1 Released",
            "link": "/change-log/release/version-2.0.1.1-released"
          },
          {
            "text": "Version 2.0.1.0 Released",
            "link": "/change-log/release/version-2.0.1.0-released"
          },
          {
            "text": "Version 2.0.0.9 Released",
            "link": "/change-log/release/version-2.0.0.9-released"
          },
          {
            "text": "Version 2.0.0.8 Released",
            "link": "/change-log/release/version-2.0.0.8-released"
          },
          {
            "text": "Version 2.0.0.7 Released",
            "link": "/change-log/release/version-2.0.0.7-released"
          },
          {
            "text": "Version 2.0.0.6 Released",
            "link": "/change-log/release/version-2.0.0.6-released"
          },
          {
            "text": "Version 2.0.0.5 Released",
            "link": "/change-log/release/version-2.0.0.5-released"
          },
          {
            "text": "Version 2.0.0.4 Released",
            "link": "/change-log/release/version-2.0.0.4-released"
          },
          {
            "text": "Version 2.0.0.3 Released",
            "link": "/change-log/release/version-2.0.0.3-released"
          },
          {
            "text": "Version 2.0.0.2 Released",
            "link": "/change-log/release/version-2.0.0.2-released"
          },
          {
            "text": "Version 2.0.0.1 Released",
            "link": "/change-log/release/version-2.0.0.1-released"
          },
          {
            "text": "Version 2.0.0.0 Released",
            "link": "/change-log/release/version-2.0.0.0-released"
          },
          {
            "text": "Version 1.0.0.41 Released",
            "link": "/change-log/release/version-1.0.0.41-released"
          },
          {
            "text": "Version 1.0.0.40 Released",
            "link": "/change-log/release/version-1.0.0.40-released"
          },
          {
            "text": "Version 1.0.0.39 Released",
            "link": "/change-log/release/version-1.0.0.39-released"
          },
          {
            "text": "Version 1.0.0.38 Released",
            "link": "/change-log/release/version-1.0.0.38-released"
          },
          {
            "text": "Version 1.0.0.37 Launched",
            "link": "/change-log/release/version-1.0.0.37-launched"
          },
          {
            "text": "Version 1.0.0.36 Launched",
            "link": "/change-log/release/version-1.0.0.36-launched"
          },
          {
            "text": "Version 1.0.0.35 Launched",
            "link": "/change-log/release/version-1.0.0.35-launched"
          },
          {
            "text": "Version 1.0.0.34 Launched",
            "link": "/change-log/release/version-1.0.0.34-launched"
          },
          {
            "text": "Version 1.0.0.33 Launched",
            "link": "/change-log/release/version-1.0.0.33-launched"
          },
          {
            "text": "Version 1.0.0.32 Launched",
            "link": "/change-log/release/version-1.0.0.32-launched"
          },
          {
            "text": "Version 1.0.0.31 Launched",
            "link": "/change-log/release/version-1.0.0.31-launched"
          },
          {
            "text": "Version 1.0.0.30 Launched",
            "link": "/change-log/release/version-1.0.0.30-launched"
          },
          {
            "text": "Version 1.0.0.29 Launched",
            "link": "/change-log/release/version-1.0.0.29-launched"
          },
          {
            "text": "Version 1.0.0.28 Launched",
            "link": "/change-log/release/version-1.0.0.28-launched"
          },
          {
            "text": "Version 1.0.0.27 Launched",
            "link": "/change-log/release/version-1.0.0.27-launched"
          },
          {
            "text": "Version 1.0.0.26 Launched",
            "link": "/change-log/release/version-1.0.0.26-launched"
          },
          {
            "text": "Version 1.0.0.25 Launched",
            "link": "/change-log/release/version-1.0.0.25-launched"
          },
          {
            "text": "Version 1.0.0.24 Launched",
            "link": "/change-log/release/version-1.0.0.24-launched"
          },
          {
            "text": "Version 1.0.0.23 Launched",
            "link": "/change-log/release/version-1.0.0.23-launched"
          },
          {
            "text": "Version 1.0.0.22 Launched",
            "link": "/change-log/release/version-1.0.0.22-launched"
          },
          {
            "text": "Version 1.0.0.21 Launched",
            "link": "/change-log/release/version-1.0.0.21-launched"
          },
          {
            "text": "Version 1.0.0.20 Launched",
            "link": "/change-log/release/version-1.0.0.20-launched"
          },
          {
            "text": "Version 1.0.0.19 Launched",
            "link": "/change-log/release/version-1.0.0.19-launched"
          },
          {
            "text": "Version 1.0.0.18 Launched",
            "link": "/change-log/release/version-1.0.0.18-launched"
          },
          {
            "text": "Version 1.0.0.17 Launched",
            "link": "/change-log/release/version-1.0.0.17-launched"
          },
          {
            "text": "Version 1.0.0.16 Launched",
            "link": "/change-log/release/version-1.0.0.16-launched"
          },
          {
            "text": "Version 1.0.0.15 Launched",
            "link": "/change-log/release/version-1.0.0.15-launched"
          },
          {
            "text": "Version 1.0.0.14 Launched",
            "link": "/change-log/release/version-1.0.0.14-launched"
          },
          {
            "text": "Version 1.0.0.13 Launched",
            "link": "/change-log/release/version-1.0.0.13-launched"
          },
          {
            "text": "Version 1.0.0.12 Launched",
            "link": "/change-log/release/version-1.0.0.12-launched"
          },
          {
            "text": "Version 1.0.0.11 Launched",
            "link": "/change-log/release/version-1.0.0.11-launched"
          },
          {
            "text": "Version 1.0.0.10 Launched",
            "link": "/change-log/release/version-1.0.0.10-launched"
          },
          {
            "text": "Version 1.0.0.9 Launched",
            "link": "/change-log/release/version-1.0.0.9-launched"
          },
          {
            "text": "Version 1.0.0.8 Launched",
            "link": "/change-log/release/version-1.0.0.8-launched"
          },
          {
            "text": "Version 1.0.0.7 Launched",
            "link": "/change-log/release/version-1.0.0.7-launched"
          },
          {
            "text": "Version 1.0.0.6 Launched",
            "link": "/change-log/release/version-1.0.0.6-launched"
          },
          {
            "text": "Version 1.0.0.5 Launched",
            "link": "/change-log/release/version-1.0.0.5-launched"
          },
          {
            "text": "Version 1.0.0.4 Launched",
            "link": "/change-log/release/version-1.0.0.4-launched"
          },
          {
            "text": "Version 1.0.0.3 Launched",
            "link": "/change-log/release/version-1.0.0.3-launched"
          },
          {
            "text": "Version 1.0.0.2 Launched",
            "link": "/change-log/release/version-1.0.0.2-launched"
          },
          {
            "text": "Version 1.0.0.1 Launched",
            "link": "/change-log/release/version-1.0.0.1-launched"
          },
          {
            "text": "Version 1.0.0.0 Launched",
            "link": "/change-log/release/version-1.0.0.0-launched"
          }
        ],
        "collapsed": true
      }
    ]
  }
],

    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/wesoftcorp/tradeboard-docs' }
    ],

    footer: {
      message: 'Released under open-source software license. Powered by <a href="https://wesoftcorp.com" target="_blank" rel="noopener noreferrer">wesoftcorp.com</a>',
      copyright: 'Copyright &copy; 2026 <a href="https://rajeevupadhyay.com" target="_blank" rel="noopener noreferrer">Rajeev Upadhyay</a> | Tradeboard. All rights reserved.'
    }
  }
})
