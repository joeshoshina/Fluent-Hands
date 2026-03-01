# app_tf_only.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the SavedModel directly
saved_model = tf.saved_model.load("tf_asl_letters_model")

# Get the default serving function
infer = saved_model.signatures["serving_default"]

# Map output indices to letters
letters = [chr(i) for i in range(ord("A"), ord("Z")+1)]

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    features = data.get("features")
    if features is None:
        return jsonify({"error": "No features provided"}), 400

    landmarks = np.array(features).reshape(21, 3)

    # Normalize exactly like training
    landmarks = landmarks - landmarks[0]  # center on wrist

    max_val = np.max(np.abs(landmarks))
    if max_val != 0:
        landmarks = landmarks / max_val

    normalized_features = landmarks.flatten()

    input_tensor = tf.convert_to_tensor(
        [normalized_features],
        dtype=tf.float32
    )

    # Make prediction
    output = infer(input_tensor)
    # The output dict key depends on your model signature, usually 'dense' or 'output_0'
    output_key = list(output.keys())[0]  
    pred = output[output_key].numpy()  # convert to NumPy array

    letter_index = int(np.argmax(pred))
    return jsonify({"letter": letters[letter_index]})

if __name__ == "__main__":
    app.run(port=5000, debug=True)