# K-Means Explorer: Interactive Clustering Visualizer

The K-Means Explorer is an interactive web application designed to help users fully understand the **K-Means Clustering Algorithm**. It visually separates the two core steps of K-Means—**Assignment** (coloring points) and **Update** (moving centroids)—in an engaging, step-by-step manner.

Built with **Python (Flask)** for heavy-duty ML calculation and **JavaScript (D3.js)** for dynamic frontend animation, this project demonstrates a robust full-stack solution for educational data science tools.

## Live Demonstration (GIF)

Watch the K-Means algorithm converge in real-time as centroids move toward optimal positions:

![KMeans-Explorer GIF (2)](https://github.com/user-attachments/assets/abf69561-d83c-4f6f-a257-90d97d2c03e8)

---

## Key Features

* **Step-by-Step Iteration:** Manually advance through each iteration of the K-Means algorithm.
* **Dynamic Visualization:** Observe **centroids (stars)** move with a smooth, exaggerated animation, and see **data points (circles)** instantly switch cluster assignments (color).
* **K Control:** Easily select the number of clusters ($K$) from 2 to 7.
* **Data Generation:** Generate new, distinct 2D synthetic datasets with a single click to observe different convergence patterns.

## Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend (ML Logic)** | **Python** (Flask, Scikit-learn, NumPy) | Generates synthetic data and calculates all step-by-step positions for centroids and cluster labels via API. |
| **Frontend (Visualization)** | **JavaScript** (D3.js) | Renders the SVG scatter plot, handles complex data binding, and manages all transitions/animations. |
| **Frontend (Structure)** | **HTML5 & CSS3** | Provides the user interface structure and appealing styling. |

---

## Getting Started

Follow these instructions to set up and run the K-Means Explorer locally.

### Prerequisites

* Python 3.8+
* `pip` for package installation

### 1. Install Dependencies

Install the required Python libraries:

```bash
pip install -r requirements.txt
```

## Usage Flow

* Click **"1. Generate New Data"** to fetch initial data points from Python.

* Select your desired **K value**.

* Click **"2. Run K-Means (Initialize)"** — this initializes the centroids and performs the first assignment.

* Repeatedly click **"3. Next Step (Iterate)"** to visualize the algorithm’s progression until convergence.

---
Contact email: holandawallacecosta@gmail.com
