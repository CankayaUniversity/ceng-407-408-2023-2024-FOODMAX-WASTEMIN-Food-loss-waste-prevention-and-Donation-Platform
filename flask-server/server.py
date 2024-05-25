from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity
from scipy import sparse

app = Flask(__name__)
CORS(app)

# Load the data
df = pd.read_csv(r'../sentetik_veri.csv')

# Set up the TF-IDF vectorizer and the StandardScaler
text_features = ['PostAllergyWarning', 'PostFoodProvider', 'PostDescription']
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(df[text_features].apply(lambda x: ' '.join(x), axis=1))

numeric_features = ['PostPrice', 'PostQuantity']
scaler = StandardScaler()
# Make sure to retain DataFrame structure with columns for scaling
df_numeric = df[numeric_features]
scaled_numeric = scaler.fit_transform(df_numeric)

# Create the feature matrix
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
    numeric_input = scaler.transform(numeric_data)  # Uses DataFrame to keep column names
    
    # Combine features and compute similarity scores
    input_features = sparse.hstack((tfidf_input, sparse.csr_matrix(numeric_input)))
    similarity_scores = cosine_similarity(input_features, merged_features)
    
    # Select the top k similar items
    similar_indices = similarity_scores.argsort()[0][-k-1:-1][::-1]
    recommended_products = df.iloc[similar_indices]
    
    # Create a list of dictionaries with detailed information
    recommendations = []
    for _, row in recommended_products.iterrows():
        recommendations.append({
            "DocumentID": row['Document ID'],
            "PostTitle": row['PostTitle'],
            "PostAllergyWarning": row['PostAllergyWarning'],
            "PostDate": row['PostDate'],
            "PostDescription": row['PostDescription'],
            "PostExpiry": row['PostExpiry'],
            "PostFoodProvider": row['PostFoodProvider'],
            "PostFoodType": row['PostFoodType'],
            "PostPhotos": row['PostPhotos'],
            "PostPrice": row['PostPrice'],
            "PostQuantity": row['PostQuantity'],
            "PostId": row['PostId']
        })
    return recommendations

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
