# 🌱 Smart Urban Plantation Recommendation Platform

> **A data-driven decision support system for urban tree plantation planning**

---

## 📌 Overview

Urban areas are increasingly affected by **urban heat islands, air pollution, and loss of green cover**.  
This project provides a **GIS, satelllite-imagery data and AI** that helps identify:

- **Where to plant trees**
- **Which tree species to plant**
- **When to plant**
- **What future impact the plantation will have**

All recommendations are generated at the **ward level**, making the system suitable for **municipal corporations and smart city planning**.

---

## 🎯 Key Features

### 🗺️ Ward-wise Plantation Recommendation
- GeoJSON-based ward boundaries
- Ward-specific:
  - Soil type
  - Heat level
  - Plantation suitability
  - Tree species recommendation

### 🌱 Tree Species Recommendation System
- Species selected based on:
  - Soil type
  - Heat tolerance
  - Urban survivability
- Prevents random plantation by using **scientific criteria**

### 📍 Open / Free Area Detection
- Identifies land **free or suitable for plantation**
- Avoids:
  - Built-up areas
  - Roads
  - Water bodies

### 📆 Plantation Timeline Guidance
- Suggests optimal plantation periods
- Supports seasonal and climate-aware planning

### 📈 Future Impact Prediction
- Python-based model predicts:
  - Increase in green cover
  - Reduction in heat stress
  - Long-term environmental benefits

### 🔎 Interactive Dashboard
- Search by:
  - Ward number
  - Area name
  - Soil type
  - Tree species
- Clean pagination and user-friendly UI

---

## 🛠️ Tech Stack

### 🌐 Frontend
- **React** (with Vite)
- **Tailwind CSS**
- Interactive and responsive UI

### 🗺️ GIS & Geospatial Tools
- **GeoJSON** for ward boundaries and attributes
- **QGIS** for spatial analysis and classification
- **Google Earth Engine (GEE)** for satellite data processing

### 🛰️ Remote Sensing
- **Sentinel-2A** satellite imagery
- Multi-band analysis for land-use classification

### 🤖 Machine Learning
- **Random Forest Classifier**
- Used to detect:
  - Open land
  - Vegetation
  - Built-up areas

### 🐍 Backend & Analytics
- **Python**
- Future impact prediction models

---

## 🧠 Methodology

### 1️⃣ Ward Boundary Mapping
- Ward boundaries plotted in **Google Earth Engine**
- Exported as **GeoJSON**

### 2️⃣ Satellite Data Processing
- Sentinel-2A imagery processed in GEE
- Cloud masking and band selection applied

### 3️⃣ Land Classification
- Random Forest classification in **QGIS**
- Land classified into:
  - Built-up
  - Open land
  - Vegetation
  - Water

### 4️⃣ Plantation Suitability Analysis
- Extracted open/free land
- Intersected with ward boundaries

### 5️⃣ Tree Recommendation Logic
- Soil type + heat level mapped to suitable tree species
- Ward-wise recommendations generated

### 6️⃣ Future Impact Prediction
- Python models estimate post-plantation benefits
- Helps in long-term urban planning decisions

