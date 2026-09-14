# Correlation Heatmap

## Tradeboard Stock Correlation Heatmap Application

### Overview

A financial analysis tool that visualizes statistical relationships between India's top 8 Nifty 50 stocks using color-coded correlation heatmaps. Helps traders and portfolio managers identify diversification opportunities and sector clustering patterns.

### Prerequisites

* **Tradeboard Python SDK**: `pip install tradeboard` (2.0.3 or higher)
* **Tradeboard Self-Hosted**: Running on `http://127.0.0.1:5000`
* **Valid API Key**: Generated from Tradeboard web interface
* **Market Data Access**: NSE data permissions

<figure><img src="/assets/image (122).png" alt=""><figcaption></figcaption></figure>

### What It Does

#### Data Analysis

* Fetches daily price data for 8 major stocks (RELIANCE, TCS, HDFCBANK, INFY, ICICIBANK, HINDUNILVR, SBIN, AXISBANK)
* Calculates 20-day rolling correlations between all stock pairs
* Generates symmetric correlation matrix with latest market relationships

```python
#!/usr/bin/env python3
"""
Simple Correlation Heatmap - No prints, only visualization
"""

from tradeboard import api, ta
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from datetime import datetime, timedelta
import time

def main():
    print("Tradeboard Python Bot is running.")
    
    # Initialize Tradeboard client
    client = api(
        api_key='your_api_key_here',
        host='http://127.0.0.1:5000'
    )
    
    # Top 8 Nifty 50 stocks
    nifty_top8 = [
        "RELIANCE", "TCS", "HDFCBANK", "INFY", 
        "ICICIBANK", "HINDUNILVR", "SBIN", "AXISBANK"
    ]
    
    # Date range
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = (datetime.now() - timedelta(days=60)).strftime("%Y-%m-%d")
    
    # Fetch data
    stock_data = {}
    for stock in nifty_top8:
        time.sleep(1)
        try:
            data = client.history(symbol=stock, exchange="NSE", interval="D", 
                                start_date=start_date, end_date=end_date)
            data.reset_index(inplace=True)
            stock_data[stock] = data[['timestamp', 'close']].rename(columns={'close': stock})
        except:
            continue
    
    # Merge data
    merged_data = None
    for stock, data in stock_data.items():
        if merged_data is None:
            merged_data = data
        else:
            merged_data = pd.merge(merged_data, data, on='timestamp', how='inner')
    
    # Calculate 20-day rolling correlations
    stock_columns = [col for col in merged_data.columns if col != 'timestamp']
    correlation_data = {}
    
    for i, stock1 in enumerate(stock_columns):
        correlation_data[stock1] = {}
        for j, stock2 in enumerate(stock_columns):
            if i == j:
                correlation_data[stock1][stock2] = 1.0
            else:
                rolling_corr = ta.correlation(merged_data[stock1], merged_data[stock2], period=20)
                latest_corr = rolling_corr.dropna().iloc[-1] if len(rolling_corr.dropna()) > 0 else 0.0
                correlation_data[stock1][stock2] = latest_corr
    
    # Create correlation matrix
    correlation_matrix = pd.DataFrame(correlation_data)
    
    # Create heatmap
    plt.figure(figsize=(12, 10))
    sns.heatmap(correlation_matrix, annot=True, cmap='RdYlBu_r', center=0, 
                square=True, fmt='.3f', linewidths=0.5,
                cbar_kws={'label': 'Correlation Coefficient'})
    
    plt.title('Nifty 50 Top 8 Stocks - 20 Day Correlation Matrix', 
              fontsize=16, fontweight='bold', pad=20)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()
    plt.show()
    
    return correlation_matrix

if __name__ == "__main__":
    corr_matrix = main()
```

#### Visualization

* Creates professional heatmap using color-coded correlation coefficients
* Red colors indicate strong positive correlation (stocks move together)
* Blue colors show weak/negative correlation (stocks move independently)
* Displays exact correlation values on each cell for precise analysis

### Key Features

#### Smart Data Processing

* **60-day lookback** for robust correlation calculation
* **Rate limiting** with 1-second delays between API calls
* **Error handling** continues analysis if individual stocks fail
* **Data alignment** ensures all stocks use identical trading dates

#### Professional Output

* **Publication-quality** heatmap visualization
* **Intuitive color scheme** for immediate insight recognition
* **Proper labeling** with rotated stock symbols
* **Statistical annotations** showing exact correlation values

### Business Applications

#### Portfolio Management

* **Diversification Analysis**: Identify low-correlation stocks for risk reduction
* **Sector Clustering**: Understand which stocks move together
* **Risk Assessment**: Quantify asset relationships during market events

#### Trading Insights

* **Pairs Trading**: Find stocks with stable correlation patterns
* **Hedge Selection**: Choose assets with negative correlation for hedging
* **Sector Rotation**: Time market entry based on correlation changes

### Interpretation Guide

#### High Correlation (>0.8)

* Banking stocks (HDFC, ICICI, SBI, AXIS) typically cluster together
* IT stocks (TCS, INFY) often show strong correlation
* Limited diversification benefits

#### Moderate Correlation (0.4-0.7)

* Related business models with some independence
* Balanced portfolio exposure opportunities
* Sector interconnectedness

#### Low Correlation (<0.4)

* Strong diversification potential
* Independent price movements
* Risk mitigation opportunities

### Technical Approach

#### Correlation Method

* Uses Tradeboard's `ta.correlation()` with 20-day rolling window
* Captures current market conditions vs. historical averages
* Updates dynamically with latest price movements

#### Data Quality

* Validates sufficient data points for meaningful correlation
* Handles missing data gracefully
* Ensures temporal consistency across all assets

### Limitations

* **Linear relationships only**: Doesn't capture non-linear correlations
* **Historical bias**: Past patterns may not predict future relationships
* **Market regime sensitivity**: Correlations change during bull/bear markets
* **NSE trading hours**: Analysis limited to exchange operating sessions

### Use Cases

**For Portfolio Managers**: Optimize asset allocation and reduce concentration risk

**For Traders**: Identify pair trading opportunities and market relationships

**For Risk Analysts**: Monitor portfolio correlation exposure and stress test scenarios

**For Researchers**: Study sector dynamics and market structure relationships

This application transforms complex statistical relationships into actionable investment insights through intuitive visual analysis.
