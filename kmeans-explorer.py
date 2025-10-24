import numpy as np
import json
from flask import Flask, render_template, request, jsonify
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

kmeans_state = {}

def get_kmeans_steps(X, n_clusters, max_iter=10):
    """
    Simulates the K-Means algorithm step-by-step for visualization.
    Returns a list of states (iterations).
    """
    steps = []

    # 1. Initialization (using 'random' init for a good demonstration)
    kmeans_obj = KMeans(n_clusters=n_clusters, init='random', n_init=1, max_iter=1, random_state=None,
                        algorithm='lloyd')

    kmeans_obj.fit(X)

    current_labels = kmeans_obj.predict(X)
    steps.append({
        'iteration': 0,
        'centroids': kmeans_obj.cluster_centers_.tolist(),
        'labels': current_labels.tolist()
    })

    # 2. Subsequent Iterations (Assignment and Movement)
    for i in range(1, max_iter + 1):
        old_centroids = kmeans_obj.cluster_centers_.copy()

        # Simulate one complete K-Means iteration (Assignment + Update)
        # We pass the old centroids as the 'init' to force the next step
        kmeans_obj = KMeans(n_clusters=n_clusters, init=old_centroids, n_init=1, max_iter=1, random_state=None,
                            algorithm='lloyd')
        kmeans_obj.fit(X)

        current_labels = kmeans_obj.predict(X)

        steps.append({
            'iteration': i,
            'centroids': kmeans_obj.cluster_centers_.tolist(),
            'labels': current_labels.tolist()
        })

        # Stop criterion: if the centroids no longer move significantly
        if np.allclose(old_centroids, kmeans_obj.cluster_centers_):
            break

    return steps


@app.route('/')
def index():
    """Main route to serve the frontend."""
    return render_template('index.html')


@app.route('/api/generate_data', methods=['GET'])
def generate_data():
    """Generates a new 2D synthetic dataset (blobs)."""
    global kmeans_state

    n_samples = 400
    centers = 4

    X, _ = make_blobs(n_samples=n_samples, centers=centers, cluster_std=0.8, random_state=np.random.randint(0, 1000))

    data = X.tolist()

    # Store the data globally for K-Means use
    kmeans_state['data'] = data

    return jsonify({'data': data})


@app.route('/api/run_kmeans', methods=['POST'])
def run_kmeans():
    """Runs K-Means step-by-step and returns all computed iterations."""
    global kmeans_state

    if 'data' not in kmeans_state:
        return jsonify({'error': 'Data not generated. Call /api/generate_data first.'}), 400

    content = request.json
    n_clusters = int(content.get('k', 3))

    X = np.array(kmeans_state['data'])

    steps = get_kmeans_steps(X, n_clusters)

    return jsonify({'steps': steps})


if __name__ == '__main__':
    # Run in debug mode for development
    app.run(debug=True)
