from flask import Flask, request, jsonify
import joblib
import string
from nltk.corpus import stopwords
import nltk

from flask_cors import CORS


# Enable CORS for all routes and origins


# Download stopwords if not already present
nltk.download('stopwords')

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Load the trained model and vectorizer (without custom preprocessor)
model = joblib.load("../models/model.pkl")
vectorizer = joblib.load("../models/vectorizer.pkl")

# Preprocessing function (remove punctuation and stopwords)
def process(text):
    nopunc = ''.join([char for char in text if char not in string.punctuation])
    return ' '.join([word for word in nopunc.split() if word.lower() not in stopwords.words('english')])

# API endpoint to predict whether an email is spam
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get the email content from the request
        data = request.get_json()
        email_text = data.get('email')

        # Check if email is provided
        if not email_text:
            return jsonify({"error": "No email content provided"}), 400

        # Preprocess the email text
        email_processed = process(email_text)

        # Transform the preprocessed text using the vectorizer
        email_vectorized = vectorizer.transform([email_processed])

        # Predict using the model
        prediction = model.predict(email_vectorized)

        # Return the prediction result as JSON
        result = {
            "prediction": "spam" if prediction[0] == 1 else "not spam"
        }
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Main function to run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
