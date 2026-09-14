# Indicators

## Tradeboard Technical Indicators Library

Tradeboard Technical Indicators is a high-performance Python library designed for comprehensive technical analysis with a focus on speed, accuracy, and ease of use. It exposes 127 indicators and helper functions across all major categories through a single `ta` object.

The indicator math runs in a compiled Rust core (`tradeboard._oaindicators`) reached through `tradeboard.indicators`. There is no JIT warm-up and no first-call compilation pause: the first call is as fast as the thousandth. `numba` and `llvmlite` are no longer dependencies; `tradeboard.numba_shim` only survives so that legacy `from tradeboard.numba_shim import jit` imports keep working, and its decorators are no-ops.

Every function accepts a NumPy array, a pandas Series or a plain list. The indicators return the same container type they were given, so a pandas Series in means a pandas Series out with the original index preserved. The thirteen signal helpers (`crossover`, `crossunder`, `cross`, `highest`, `lowest`, `change`, `roc`, `stdev`, `rising`, `falling`, `exrem`, `flip`, `valuewhen`) are the exception: they always return a plain NumPy array. Wrap them in `pd.Series(result, index=df.index)` if you need index alignment or `.iloc` access.

### Import Statement

```python
from tradeboard import ta
```

To see the full list at runtime:

```python
from tradeboard import ta

names = [n for n in dir(ta) if not n.startswith('_')]
print(len(names))   # 127
print(sorted(names))
```

### List of Supported Indicators

### Trend Indicators

* **SMA** - Simple Moving Average
* **EMA** - Exponential Moving Average
* **WMA** - Weighted Moving Average
* **DEMA** - Double Exponential Moving Average
* **TEMA** - Triple Exponential Moving Average
* **HMA** - Hull Moving Average
* **VWMA** - Volume Weighted Moving Average
* **ALMA** - Arnaud Legoux Moving Average
* **KAMA** - Kaufman's Adaptive Moving Average
* **ZLEMA** - Zero Lag Exponential Moving Average
* **T3** - T3 Moving Average
* **FRAMA** - Fractal Adaptive Moving Average
* **TRIMA** - Triangular Moving Average
* **McGinley** - McGinley Dynamic
* **VIDYA** - Variable Index Dynamic Average
* **Alligator** - Bill Williams Alligator
* **MovingAverageEnvelopes** - Moving Average Envelopes
* **Supertrend** - Supertrend Indicator
* **Ichimoku** - Ichimoku Cloud
* **ChandeKrollStop** - Chande Kroll Stop

### Momentum Indicators

* **RSI** - Relative Strength Index
* **MACD** - Moving Average Convergence Divergence
* **Stochastic** - Stochastic Oscillator
* **CCI** - Commodity Channel Index
* **WilliamsR** - Williams %R
* **BOP** - Balance of Power
* **ElderRay** - Elder Ray Index (Bull/Bear Power)
* **Fisher** - Fisher Transform
* **CRSI** - Connors RSI
* **MOM** - Momentum (`ta.mom`)
* **APO** - Absolute Price Oscillator (`ta.apo`)
* **ROCP** - Rate of Change Percentage (`ta.rocp`)
* **ROCR** - Rate of Change Ratio (`ta.rocr`)
* **ROCR100** - Rate of Change Ratio x 100 (`ta.rocr100`)
* **STOCHF** - Fast Stochastic (`ta.stochf`)

### Volatility Indicators

* **ATR** - Average True Range
* **BollingerBands** - Bollinger Bands
* **Keltner** - Keltner Channel
* **Donchian** - Donchian Channel
* **Chaikin** - Chaikin Volatility
* **NATR** - Normalized Average True Range
* **ULTOSC** - Ultimate Oscillator
* **TRANGE** - True Range
* **MASS** - Mass Index
* **BBPercent** - Bollinger Bands %B
* **BBWidth** - Bollinger Bandwidth
* **ChandelierExit** - Chandelier Exit
* **HistoricalVolatility** - Historical Volatility
* **UlcerIndex** - Ulcer Index
* **STARC** - STARC Bands

### Volume Indicators

* **OBV** - On Balance Volume
* **OBVSmoothed** - On Balance Volume with Smoothing
* **VWAP** - Volume Weighted Average Price
* **MFI** - Money Flow Index
* **ADL** - Accumulation/Distribution Line
* **CMF** - Chaikin Money Flow
* **EMV** - Ease of Movement
* **FI** - Elder Force Index
* **NVI** - Negative Volume Index
* **NVI with EMA** - Negative Volume Index plus EMA signal line (`ta.nvi_with_ema`)
* **PVI** - Positive Volume Index
* **PVI with Signal** - Positive Volume Index plus signal line (`ta.pvi_with_signal`)
* **VOLOSC** - Volume Oscillator
* **VROC** - Volume Rate of Change
* **KlingerVolumeOscillator** - Klinger Volume Oscillator
* **PriceVolumeTrend** - Price Volume Trend
* **RVOL** - Relative Volume

### Oscillators

* **ROC** - Rate of Change
* **CMO** - Chande Momentum Oscillator
* **TRIX** - Triple Exponential Average
* **UO** - Ultimate Oscillator
* **AO** - Awesome Oscillator
* **AC** - Accelerator Oscillator
* **PPO** - Percentage Price Oscillator
* **PO** - Price Oscillator
* **DPO** - Detrended Price Oscillator
* **AROONOSC** - Aroon Oscillator
* **StochRSI** - Stochastic RSI
* **RVI** - Relative Vigor Index (`ta.rvi`, the only RVI exposed on `ta`)
* **CHO** - Chaikin Oscillator
* **CHOP** - Choppiness Index
* **KST** - Know Sure Thing
* **TSI** - True Strength Index
* **VI** - Vortex Indicator
* **STC** - Schaff Trend Cycle
* **GatorOscillator** - Gator Oscillator
* **Coppock** - Coppock Curve

### Statistical Indicators

* **LINREG** - Linear Regression
* **LRSLOPE** - Linear Regression Slope
* **CORREL** - Pearson Correlation Coefficient
* **BETA** - Beta Coefficient
* **VAR** - Variance
* **TSF** - Time Series Forecast
* **MEDIAN** - Rolling Median
* **MedianBands** - Median with Bands
* **MODE** - Rolling Mode
* **LINEARREG\_ANGLE** - Linear Regression Angle (`ta.linregangle`)
* **LINEARREG\_INTERCEPT** - Linear Regression Intercept (`ta.linregintercept`)

### Hybrid Indicators

* **ADX** - Average Directional Index
* **Aroon** - Aroon Indicator
* **PivotPoints** - Pivot Points
* **SAR** - Parabolic SAR
* **DMI** - Directional Movement Index
* **WilliamsFractals** - Williams Fractals
* **RWI** - Random Walk Index
* **PLUS\_DM** - Plus Directional Movement (`ta.plus_dm`)
* **MINUS\_DM** - Minus Directional Movement (`ta.minus_dm`)
* **DX** - Directional Movement Index value (`ta.dx`)
* **ADXR** - Average Directional Movement Rating (`ta.adxr`)

### Utility Functions

* **crossover** - Series crossover detection
* **crossunder** - Series crossunder detection
* **highest** - Highest value over period
* **lowest** - Lowest value over period
* **change** - Change in value
* **roc** - Rate of change
* **stdev** - Standard deviation
* **exrem** - Excess removal
* **flip** - Flip function
* **valuewhen** - Value when condition
* **rising** - Rising detection
* **falling** - Falling detection
* **cross** - Cross detection (both directions)
* **midpoint** - Midpoint of the highest and lowest value over a period
* **midprice** - Midpoint of the highest high and lowest low over a period
* **medprice** - Median price, (high + low) / 2
* **typprice** - Typical price, (high + low + close) / 3
* **wclprice** - Weighted close price, (high + low + close x 2) / 4
* **avgprice** - Average price, (open + high + low + close) / 4

### Perfect For

* **Quantitative Analysts** building trading strategies
* **Financial Engineers** developing risk management systems
* **Algorithmic Traders** requiring fast, reliable technical analysis
* **Research Teams** conducting market analysis and backtesting
* **Financial Applications** needing embedded technical analysis capabilities

Tradeboard Indicators bridges the gap between ease of use and performance, making sophisticated technical analysis accessible to both beginners and experts while maintaining the speed and accuracy demanded by professional trading systems.
