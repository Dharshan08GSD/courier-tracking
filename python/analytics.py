"""
================================================================================
COURIER AND PARCEL TRACKING MANAGEMENT SYSTEM (Scenario 26)
Course: 25ITC31 - Foundations of Data Science
Student: Dharshan S | Reg No: 732925ITR026 | Class: 25IT3A
Department of Information Technology, Velalar College of Engineering and Technology
================================================================================
This script performs data retrieval, cleaning, transformation, summary statistics,
and publication-quality visualizations using Pandas, NumPy, Matplotlib, and Seaborn.
"""

import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set aesthetics
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
sns.set_palette("crest")
plt.rcParams['font.sans-serif'] = 'Arial'
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['figure.dpi'] = 300

def load_and_preprocess_data(file_path):
    print("=" * 70)
    print("STEP 1: DATA INGESTION & QUALITY ASSESSMENT (Unit 2 & Unit 4)")
    print("=" * 70)
    
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset not found at {file_path}")
        
    df = pd.read_csv(file_path)
    print(f"Loaded {len(df)} records across {len(df.columns)} features.")
    print("Initial Column Names:", list(df.columns))
    
    # Check for missing values
    missing = df.isnull().sum()
    print("\nMissing Values Count per Feature:")
    print(missing[missing > 0])
    
    # Preprocessing & Data Cleaning (Unit 4: Missing Value Handling & Data Type Conversion)
    df['booking_date'] = pd.to_datetime(df['booking_date'])
    df['estimated_delivery'] = pd.to_datetime(df['estimated_delivery'])
    df['actual_delivery'] = pd.to_datetime(df['actual_delivery'])
    
    # Fill categorical nulls
    df['delivery_agent'] = df['delivery_agent'].fillna('Unassigned')
    df['failure_reason'] = df['failure_reason'].fillna('No Failure / On Schedule')
    
    # Calculate delivery duration in hours for completed deliveries
    completed_mask = df['actual_delivery'].notnull()
    df['actual_transit_hours'] = np.nan
    df.loc[completed_mask, 'actual_transit_hours'] = (
        df.loc[completed_mask, 'actual_delivery'] - df.loc[completed_mask, 'booking_date']
    ).dt.total_seconds() / 3600.0
    
    # Flag SLA compliance
    df['sla_status'] = 'Pending'
    df.loc[df['current_status'] == 'Delivered', 'sla_status'] = np.where(
        df.loc[df['current_status'] == 'Delivered', 'delay_hours'] <= 0, 'On-Time', 'Delayed'
    )
    df.loc[df['current_status'] == 'Returned', 'sla_status'] = 'Failed / Returned'
    
    # Outlier Detection on Weight & Charges using IQR (Unit 4: Outlier Treatment)
    q1 = df['weight_kg'].quantile(0.25)
    q3 = df['weight_kg'].quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    outliers = df[(df['weight_kg'] < lower_bound) | (df['weight_kg'] > upper_bound)]
    print(f"\nOutlier analysis on Parcel Weight: IQR={iqr:.2f}, Normal Range=[{lower_bound:.2f}, {upper_bound:.2f}]")
    print(f"Identified {len(outliers)} statistical weight outlier(s).")
    
    return df

def generate_descriptive_statistics(df):
    print("\n" + "=" * 70)
    print("STEP 2: DESCRIPTIVE STATISTICS & SUMMARY METRICS (Unit 1 & Unit 5)")
    print("=" * 70)
    
    stats_cols = ['weight_kg', 'base_charge', 'total_charge', 'delay_hours']
    summary = df[stats_cols].describe()
    print(summary.round(2))
    
    # Grouped aggregations (Unit 3: Data Wrangling with Pandas)
    print("\n--- Performance Metrics Grouped by Distance Category ---")
    dist_group = df.groupby('distance_category').agg(
        Total_Parcels=('parcel_id', 'count'),
        Avg_Weight=('weight_kg', 'mean'),
        Avg_Charge=('total_charge', 'mean'),
        Total_Revenue=('total_charge', 'sum'),
        Avg_Delay_Hours=('delay_hours', 'mean')
    ).round(2)
    print(dist_group)
    
    print("\n--- Shipment Status Distribution ---")
    status_counts = df['current_status'].value_counts()
    print(status_counts)
    
    return summary, dist_group

def generate_visualizations(df, output_dir):
    print("\n" + "=" * 70)
    print("STEP 3: GENERATING HIGH-RESOLUTION CHARTS (Unit 5: EDA & Visualization)")
    print("=" * 70)
    os.makedirs(output_dir, exist_ok=True)
    
    # -------------------------------------------------------------------------
    # Chart 1: Delivery Completion Rates & Status Breakdown (Donut Chart)
    # -------------------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(8, 6))
    status_counts = df['current_status'].value_counts()
    colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
    
    wedges, texts, autotexts = ax.pie(
        status_counts.values,
        labels=status_counts.index,
        autopct='%1.1f%%',
        startangle=140,
        colors=colors[:len(status_counts)],
        pctdistance=0.75,
        explode=[0.03] * len(status_counts),
        textprops={'fontsize': 11, 'weight': 'bold'}
    )
    # Donut center circle
    centre_circle = plt.Circle((0,0), 0.55, fc='white')
    fig.gca().add_artist(centre_circle)
    
    ax.set_title("Scenario 26: Parcel Delivery Status Distribution\nDharshan S | Reg: 732925ITR026", 
                 fontsize=13, weight='bold', pad=15)
    plt.tight_layout()
    chart1_path = os.path.join(output_dir, "delivery_completion_rates.png")
    plt.savefig(chart1_path, dpi=300)
    plt.close()
    print(f" Saved Chart 1 -> {chart1_path}")
    
    # -------------------------------------------------------------------------
    # Chart 2: Daily Shipment Volume and Revenue Trend
    # -------------------------------------------------------------------------
    fig, ax1 = plt.subplots(figsize=(10, 5.5))
    df['date_only'] = df['booking_date'].dt.strftime('%b %d')
    daily = df.groupby('date_only').agg(
        volume=('parcel_id', 'count'),
        revenue=('total_charge', 'sum')
    ).reset_index()
    
    x = np.arange(len(daily))
    width = 0.4
    
    bars = ax1.bar(x - width/2, daily['volume'], width, label='Parcel Volume (Count)', color='#3b82f6', alpha=0.85)
    ax1.set_ylabel('Shipment Volume (Parcels)', color='#1d4ed8', fontsize=11, weight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(daily['date_only'], fontsize=10, weight='bold')
    
    ax2 = ax1.twinx()
    lines = ax2.plot(x + width/2, daily['revenue'], color='#10b981', marker='o', linewidth=2.5, label='Gross Revenue (₹)')
    ax2.set_ylabel('Total Revenue (INR ₹)', color='#047857', fontsize=11, weight='bold')
    
    plt.title("Daily Shipment Volume vs. Total Booking Revenue Trend\nVCET IT - Scenario 26", 
              fontsize=13, weight='bold', pad=15)
    ax1.grid(True, linestyle='--', alpha=0.5)
    fig.tight_layout()
    chart2_path = os.path.join(output_dir, "shipment_volumes_trend.png")
    plt.savefig(chart2_path, dpi=300)
    plt.close()
    print(f" Saved Chart 2 -> {chart2_path}")
    
    # -------------------------------------------------------------------------
    # Chart 3: Delivery Delays by Distance Category
    # -------------------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(9, 5.5))
    cat_delays = df.groupby('distance_category')['delay_hours'].mean().reset_index()
    
    palette = {'Local': '#10b981', 'Regional': '#3b82f6', 'National': '#f59e0b', 'International': '#ef4444'}
    bar_plot = sns.barplot(
        data=cat_delays, 
        x='distance_category', 
        y='delay_hours', 
        palette=palette,
        ax=ax,
        edgecolor='black',
        linewidth=0.8
    )
    
    ax.axhline(0, color='gray', linestyle='--', linewidth=1)
    ax.set_title("Average Delivery Schedule Variance (Hours) by Distance Category\n(Negative indicates early arrival; Positive indicates delay)", 
                 fontsize=12, weight='bold', pad=15)
    ax.set_xlabel("Distance Category", fontsize=11, weight='bold')
    ax.set_ylabel("Mean Delay Hours (hrs)", fontsize=11, weight='bold')
    
    for p in bar_plot.patches:
        val = p.get_height()
        sign = "+" if val > 0 else ""
        ax.annotate(f"{sign}{val:.2f}h", 
                    (p.get_x() + p.get_width() / 2., val),
                    ha='center', va='bottom' if val >= 0 else 'top',
                    xytext=(0, 4 if val >= 0 else -12),
                    textcoords='offset points',
                    fontweight='bold', fontsize=10)
                    
    plt.tight_layout()
    chart3_path = os.path.join(output_dir, "delivery_delays_by_distance.png")
    plt.savefig(chart3_path, dpi=300)
    plt.close()
    print(f" Saved Chart 3 -> {chart3_path}")
    
    # -------------------------------------------------------------------------
    # Chart 4: Delivery Personnel Workload & Deliveries Breakdown
    # -------------------------------------------------------------------------
    fig, ax = plt.subplots(figsize=(10, 5.5))
    agent_df = df[df['delivery_agent'] != 'Unassigned']
    agent_summary = agent_df.groupby(['delivery_agent', 'current_status']).size().unstack(fill_value=0)
    
    agent_summary.plot(
        kind='barh', 
        stacked=True, 
        ax=ax, 
        colormap='Spectral', 
        edgecolor='black', 
        linewidth=0.6
    )
    
    ax.set_title("Delivery Personnel Workload Distribution by Status\nField Agent Operational Load Analysis", 
                 fontsize=12, weight='bold', pad=15)
    ax.set_xlabel("Number of Assigned Parcels", fontsize=11, weight='bold')
    ax.set_ylabel("Delivery Agent", fontsize=11, weight='bold')
    ax.legend(title="Current Status", bbox_to_anchor=(1.02, 1), loc='upper left')
    
    plt.tight_layout()
    chart4_path = os.path.join(output_dir, "personnel_workload_distribution.png")
    plt.savefig(chart4_path, dpi=300)
    plt.close()
    print(f" Saved Chart 4 -> {chart4_path}")
    
    print("\nAll 4 visualizations generated successfully in 300 DPI!")

if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.abspath(os.path.join(base_dir, ".."))
    csv_path = os.path.join(base_dir, "courier_dataset.csv")
    charts_dir = os.path.join(project_root, "assets", "charts")
    
    df = load_and_preprocess_data(csv_path)
    generate_descriptive_statistics(df)
    generate_visualizations(df, charts_dir)
