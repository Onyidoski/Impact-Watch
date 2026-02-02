import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from preprocess import clean_text  

def train_and_save_models():
    print("⏳ Loading dataset...")
    df = pd.read_csv('ai_sentiment_dataset.csv')
    
    print("🧹 Cleaning text...")
    df['clean_text'] = df['text'].apply(clean_text)
    
    print("🔢 Vectorizing text...")
    vectorizer = TfidfVectorizer(max_features=5000)
    X = vectorizer.fit_transform(df['clean_text'])
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("\n🤖 Training Model A (Naive Bayes)...")
    nb_model = MultinomialNB()
    nb_model.fit(X_train, y_train)
    nb_acc = accuracy_score(y_test, nb_model.predict(X_test))
    print(f"✅ Naive Bayes Accuracy: {nb_acc:.2%}")
    
    print("\n🤖 Training Model B (Logistic Regression)...")
    lr_model = LogisticRegression()
    lr_model.fit(X_train, y_train)
    lr_acc = accuracy_score(y_test, lr_model.predict(X_test))
    print(f"✅ Logistic Regression Accuracy: {lr_acc:.2%}")
    
    print("\n💾 Saving models to disk...")
    joblib.dump(nb_model, 'naive_bayes_model.pkl')
    joblib.dump(lr_model, 'log_reg_model.pkl')
    joblib.dump(vectorizer, 'tfidf_vectorizer.pkl')
    
    comparison_results = {
        "Model": ["Naive Bayes", "Logistic Regression"],
        "Accuracy": [nb_acc, lr_acc]
    }
    pd.DataFrame(comparison_results).to_csv("model_comparison_results.csv", index=False)
    print("✅ Training Complete! Artifacts saved.")

if __name__ == "__main__":
    train_and_save_models()