import PyPDF2
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
import nltk
nltk.download('punkt')
file_path = "sample.pdf"

with open(file_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''

    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()

parser = PlaintextParser.from_string(text, Tokenizer("french"))
summarizer = LexRankSummarizer()

summary = summarizer(parser.document, sentences_count=5)

# Output the summary
for sentence in summary:
    print(sentence)