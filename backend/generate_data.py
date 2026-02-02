import pandas as pd


texts = [
    # Economic Anxiety (Job loss, economy)
    "I am afraid AI will replace my job next year.",
    "The economy is crashing because of automation.",
    "ChatGPT is making writers obsolete, this is sad.",
    "Layoffs are coming because of new AI tools.",
    "I don't know how to survive in this AI economy.",
    
    # Ethical Concern (Privacy, deepfakes)
    "Deepfakes are going to ruin the election.",
    "I don't trust AI with my private medical data.",
    "Surveillance in this city is getting out of hand with facial recognition.",
    "Who is controlling these algorithms? It's biased.",
    "AI bias is real and it is discriminating against minorities.",
    
    # Optimism (Health, efficiency)
    "AI just helped cure a rare disease, amazing!",
    "My productivity has doubled thanks to Copilot.",
    "I love how AI handles the boring tasks for me.",
    "The future of education is bright with personalized AI tutors.",
    "Automation will give us more free time to be creative."
]

labels = [
    "Economic Anxiety", "Economic Anxiety", "Economic Anxiety", "Economic Anxiety", "Economic Anxiety",
    "Ethical Concern", "Ethical Concern", "Ethical Concern", "Ethical Concern", "Ethical Concern",
    "Optimism", "Optimism", "Optimism", "Optimism", "Optimism"
]


data_pairs = list(zip(texts, labels)) * 50


df = pd.DataFrame(data_pairs, columns=['text', 'label'])

df = df.sample(frac=1, random_state=42).reset_index(drop=True)

df.to_csv('ai_sentiment_dataset.csv', index=False)
print("✅ CORRECTED dataset generated. Rows shuffled, but labels match text.")
print(df.head())