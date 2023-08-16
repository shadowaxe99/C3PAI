```python
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

class NLPProcessor:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))

    def preprocess_text(self, text):
        tokenized_text = word_tokenize(text.lower())
        cleaned_text = [self.lemmatizer.lemmatize(word) for word in tokenized_text if word not in self.stop_words]
        return cleaned_text

    def train_word2vec(self, sentences):
        model = Word2Vec(sentences, min_count=1)
        return model

    def tfidf_vectorizer(self, documents):
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(documents)
        return tfidf_matrix

nlp_processor = NLPProcessor()
```