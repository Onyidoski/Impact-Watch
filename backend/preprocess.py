import pandas as pd
import nltk
from nltk.corpus import stopwords
import re


nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
    
    text = text.lower()
    
    text = re.sub(r'http\S+', '', text)
    
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    words = text.split()
    cleaned_words = [w for w in words if w not in stop_words]
    return " ".join(cleaned_words)

def load_and_clean_data(filepath):
    print("⏳ Loading data...")
    df = pd.read_csv(filepath)
    
    print("🧹 Cleaning text...")
    df['cleaned_text'] = df['text'].apply(clean_text)
    
    print("✅ Data cleaning complete. Preview:")
    print(df[['text', 'cleaned_text']].head())
    return df

if __name__ == "__main__":
    
    load_and_clean_data('ai_sentiment_dataset.csv')





    