## 🔮 **DEMAND FORECASTING - How It Works**

### **What We're Predicting:**
- **Target Variable**: Number of active equipment rentals per day for each Site ID + Equipment Type combination
- **Example**: How many Excavators will be actively rented at SITE011 on any given day

### **Data Transformation Process:**
1. **Raw Data → Time Series**: 
   - Take individual rental records (check-out/check-in dates)
   - For each day, count how many pieces of each equipment type are actively rented at each site
   - Result: Daily counts like "SITE011 had 3 Excavators active on 2024-01-15"

2. **Feature Engineering** (11 features total):
   - **Time Features**: Day of week, Month, Quarter, Year, Week of year
   - **Time Index**: Sequential number (T=1, 2, 3...) to capture trends
   - **Lag Features**: Yesterday's count (Lag_1), last week's count (Lag_7), last month's count (Lag_30)
   - **Rolling Features**: 7-day moving average and standard deviation

### **Model Training Strategy:**
- **120 Separate Models**: One for each unique Site ID + Equipment Type combination
- **Why Separate Models**: Each site-equipment combination has different usage patterns
- **Algorithm**: Random Forest Regressor (100 trees, max depth 10)
- **Data Split**: 80% training (chronological), 20% testing (chronological)
- **Training Data Requirement**: Minimum 50 records per combination

### **What Each Model Learns:**
- **SITE011_Excavator**: Learns patterns specific to Excavator usage at SITE011
- **SITE006_Bulldozer**: Learns patterns specific to Bulldozer usage at SITE006
- **Patterns Include**: Weekly cycles, seasonal trends, site-specific usage habits

## 🚨 **ANOMALY DETECTION - How It Works**

### **What We're Detecting:**
- **Equipment Misuse**: Unusual operating patterns that suggest problems
- **Inefficiency**: Equipment being idle too much or used too little
- **Operational Issues**: Days with zero engine hours but high idle time

### **Feature Engineering** (10 features):
1. **Usage Metrics**:
   - `Idle_Ratio`: Percentage of time equipment is idle vs. running
   - `Utilization_Efficiency`: Engine hours vs. total hours ratio
   - `Operating_Days_Ratio`: How many days equipment was actually used

2. **Binary Flags**:
   - `Zero_Engine_Hours`: Days with no actual work
   - `High_Idle_Ratio`: Days with >80% idle time
   - `Very_Low_Utilization`: Days with <20% efficiency

3. **Duration Analysis**:
   - `Rental_Duration`: How long equipment was rented
   - `Normalized_Duration`: Duration relative to maximum

### **Anomaly Detection Methods** (3 different approaches):

#### **1. Statistical Detection (Rule-based):**
- **Threshold**: 2 standard deviations from mean
- **Example**: If average idle ratio is 30% with 15% standard deviation
- **Anomaly**: Any day with idle ratio > 60% or < 0%
- **Use Case**: Simple, interpretable flags for obvious problems

#### **2. Isolation Forest:**
- **How It Works**: Creates random decision trees to isolate unusual points
- **Anomaly Score**: Points that are easier to isolate are more anomalous
- **Use Case**: Detects complex, non-linear patterns in equipment behavior
- **Contamination**: Expects 10% of data to be anomalous

#### **3. Local Outlier Factor (LOF):**
- **How It Works**: Compares each point to its neighbors
- **Anomaly Score**: Points with fewer neighbors are more anomalous
- **Use Case**: Identifies equipment that behaves differently from similar equipment
- **Neighbors**: 20 closest similar equipment records

#### **4. DBSCAN Clustering:**
- **How It Works**: Groups similar data points into clusters
- **Anomaly**: Points that don't belong to any cluster
- **Use Case**: Finds equipment that doesn't follow normal usage patterns
- **Parameters**: Maximum distance 0.5, minimum 5 points per cluster

### **Consensus Detection:**
- **Combination**: At least 2 out of 4 methods must agree
- **Result**: More reliable anomaly detection with fewer false positives
- **Example**: If statistical method AND isolation forest both flag a record, it's likely truly anomalous

## �� **SPECIFIC USE CASES & EXAMPLES**

### **Demand Forecasting Cases:**

#### **Case 1: Weekly Planning**
- **Input**: "How many Excavators will SITE011 need next week?"
- **Process**: Model uses last week's data, seasonal patterns, day-of-week effects
- **Output**: [2, 3, 2, 3, 4, 1, 2] (one prediction per day)

#### **Case 2: Seasonal Planning**
- **Input**: "How many Bulldozers will SITE006 need in December?"
- **Process**: Model learns from historical December patterns, weather effects, holiday impacts
- **Output**: Average daily demand for December

#### **Case 3: Capacity Planning**
- **Input**: "Do we have enough Cranes for all sites next month?"
- **Process**: Sum predictions across all sites for Crane equipment
- **Output**: Total Crane demand vs. available inventory

### **Anomaly Detection Cases:**

#### **Case 1: Equipment Abuse Detection**
- **Scenario**: Excavator at SITE011 shows 0 engine hours but 12 idle hours
- **Detection**: High idle ratio + zero usage flags trigger anomaly
- **Action**: Investigate if equipment was left running unnecessarily

#### **Case 2: Inefficient Usage**
- **Scenario**: Bulldozer at SITE006 shows 2 engine hours, 10 idle hours (83% idle)
- **Detection**: High idle ratio + very low utilization triggers anomaly
- **Action**: Check if operator training is needed or if equipment is too large for the job

#### **Case 3: Maintenance Issues**
- **Scenario**: Crane at SITE016 shows unusual engine hours pattern
- **Detection**: Statistical deviation + isolation forest both flag the pattern
- **Action**: Schedule maintenance check for potential mechanical issues

#### **Case 4: Site-Specific Problems**
- **Scenario**: All equipment at SITE008 shows higher idle ratios than other sites
- **Detection**: LOF identifies SITE008 as different from peer sites
- **Action**: Investigate site management or operational issues

## 🎯 **How Models Identify Patterns**

### **Demand Forecasting Pattern Recognition:**
- **Weekly Cycles**: Models learn that Mondays typically have higher demand than Sundays
- **Seasonal Trends**: Models capture that construction peaks in summer, slows in winter
- **Site Characteristics**: Models learn that urban sites (SITE001) have different patterns than rural sites (SITE020)
- **Equipment Specialization**: Models understand that Cranes are used for longer projects than Excavators

### **Anomaly Detection Pattern Recognition:**
- **Normal Behavior**: Models learn what "typical" equipment usage looks like
- **Deviation Detection**: Models flag when equipment behavior differs significantly from learned patterns
- **Context Awareness**: Models consider site, equipment type, and time period when determining anomalies
- **Peer Comparison**: Models compare equipment to similar equipment at other sites

## 🔍 **Real-World Examples from Your Data**

### **High-Performing Models (R² = 1.000):**
- **SITE011_Excavator**: Perfect prediction because usage is very consistent
- **SITE006_Dumper**: Perfect prediction because dumpers follow regular delivery schedules

### **Challenging Models (R² < 0):**
- **SITE014_Bulldozer (R² = -4.754)**: Very unpredictable usage, might need more features
- **SITE008_Bulldozer (R² = -4.432)**: Highly variable demand, consider external factors

### **Anomaly Detection Results:**
- **Statistical**: 14 out of 146 records flagged (9.6%)
- **ML Consensus**: 17 out of 146 records flagged (11.6%)
- **Most Anomalous**: Equipment with multiple detection methods agreeing
