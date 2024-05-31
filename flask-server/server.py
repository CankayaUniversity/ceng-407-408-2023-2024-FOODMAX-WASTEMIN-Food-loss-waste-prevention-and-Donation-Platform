import os
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import base64
import json
import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse

app = Flask(__name__)
CORS(app)


dotenv_path = os.path.join(os.path.dirname(__file__), 'firebase.env')
load_dotenv(dotenv_path)


firebase_service_account_base64 = os.getenv('FIREBASE_SERVICE_ACCOUNT_BASE64')


print(f"FIREBASE_SERVICE_ACCOUNT_BASE64: {firebase_service_account_base64}")

if firebase_service_account_base64 is None:
    raise ValueError("Environment variable FIREBASE_SERVICE_ACCOUNT_BASE64 is not set.")


service_account_info = json.loads(base64.b64decode(firebase_service_account_base64))


cred = credentials.Certificate(service_account_info)
firebase_admin.initialize_app(cred)
db = firestore.client()

def fetch_data_from_firestore():
    docs = db.collection('FoodPost').stream()
    data = []
    for doc in docs:
        doc_data = doc.to_dict()
        doc_data['DocumentID'] = doc.id
        if 'PostExpiry' not in doc_data:
            doc_data['PostExpiry'] = None
        data.append(doc_data)
    return data


data = fetch_data_from_firestore()
if not data:
    print("No data available to process. Exiting.")
    exit()

df = pd.DataFrame(data)


text_features = ['PostAllergyWarning', 'PostFoodProvider', 'PostDescription']
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df[text_features].apply(lambda x: ' '.join(map(str, x)), axis=1))

numeric_features = ['PostPrice', 'PostQuantity']
scaler = StandardScaler()
df_numeric = df[numeric_features]
scaled_numeric = scaler.fit_transform(df_numeric)


merged_features = sparse.hstack((tfidf_matrix, scaled_numeric))

@app.route("/recommendations")
def recommendations():
    try:
        post_price = request.args.get('PostPrice', 0)
        post_quantity = request.args.get('PostQuantity', 0)
        
        # If post_price or post_quantity is an empty string, set them to 0
        post_price = float(post_price) if post_price else 0
        post_quantity = int(post_quantity) if post_quantity else 0

        user_features = {
            'PostAllergyWarning': request.args.get('PostAllergyWarning', ''),
            'PostFoodProvider': request.args.get('PostFoodProvider', ''),
            'PostDescription': request.args.get('PostDescription', ''),
            'PostPrice': post_price,
            'PostQuantity': post_quantity
        }

        recommended_products = get_recommendations(user_features)
        return jsonify({"recommendations": recommended_products})
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

def get_recommendations(features, k=5):
    # Process the input features
    text_data = ' '.join([str(features[feat]) for feat in text_features])
    tfidf_input = tfidf_vectorizer.transform([text_data])
    
    # Ensure to use DataFrame for numeric features transformation
    numeric_data = pd.DataFrame([[
        features['PostPrice'],
        features['PostQuantity']
    ]], columns=numeric_features)
    numeric_input = scaler.transform(numeric_data)
    

    input_features = sparse.hstack((tfidf_input, sparse.csr_matrix(numeric_input)))
    similarity_scores = cosine_similarity(input_features, merged_features)
    
  
    similar_indices = similarity_scores.argsort()[0][-k-1:-1][::-1]
    recommended_products = df.iloc[similar_indices]
    
    
    recommendations = []
    for _, row in recommended_products.iterrows():
        recommendation = {
            "DocumentID": row['DocumentID'],
            "PostTitle": row['PostTitle'],
            "PostAllergyWarning": row['PostAllergyWarning'],
            "PostDate": row['PostDate'],
            "PostDescription": row['PostDescription'],
            "PostExpiry": row['PostExpiry'] if 'PostExpiry' in row else None,
            "PostFoodProvider": row['PostFoodProvider'],
            "PostFoodType": row['PostFoodType'],
            "PostPhotos": row['PostPhotos'],
            "PostPrice": row['PostPrice'],
            "PostQuantity": row['PostQuantity'],
            "PostId": row['PostId']
        }
        recommendations.append(recommendation)
    return recommendations

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
