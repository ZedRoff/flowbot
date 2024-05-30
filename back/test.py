import PyPDF2
from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer
import nltk
nltk.download('punkt')
# Define the path to your PDF
file_path = "sample.pdf"

# Read the PDF in binary mode
with open(file_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    text = ''

    # Extract text from each page
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text += page.extract_text()

# Parse the extracted text
parser = PlaintextParser.from_string(text, Tokenizer("french"))
summarizer = LexRankSummarizer()

# Customize your summary's length
summary = summarizer(parser.document, sentences_count=5)

# Output the summary
for sentence in summary:
    print(sentence)