---
name: pdf-extractor
description: Extract structured text, tables, images, metadata, and form fields from PDF documents. Supports OCR for scanned PDFs, multi-column layout detection, and batch processing of large document sets.
license: MIT
tags: [pdf, extraction, ocr, documents, data-processing]
---

# PDF Extractor

## Overview

Extract and structure content from PDFs—including scanned documents via OCR—delivering clean text, parsed tables, identified metadata, and form data ready for downstream processing.

---

## When to Use

- Extracting invoice data from supplier PDF invoices
- Parsing technical datasheets for battery specifications
- Processing government compliance documents and permits
- Converting scanned contracts into editable text
- Batch-extracting data from hundreds of procurement PDFs

---

## Instructions

1. Accept inputs: PDF file path or URL, extraction mode (text/tables/images/forms/all), OCR flag, output format (json/csv/markdown/text).
2. Load the PDF and detect document type: digital native or scanned.
3. If scanned and OCR=true, run OCR engine (Tesseract or cloud Vision API) to convert to text.
4. Extract content based on mode:
   - Text: parse all text with page/paragraph structure preserved.
   - Tables: detect table regions, extract rows/columns into structured data.
   - Images: extract embedded images with position metadata.
   - Forms: identify form fields and their values.
5. Clean extracted text: remove headers/footers, fix encoding issues, normalize whitespace.
6. Structure output in requested format with source PDF reference and page numbers.
7. Return extraction summary: pages processed, tables found, confidence score (OCR), output file path.

---

## Environment

```
OCR_ENGINE=tesseract
GOOGLE_VISION_API_KEY=your_key_optional
OUTPUT_FORMAT=json
BATCH_SIZE=10
TEMP_DIR=./pdf_processing
```

---

## Examples

**Input:**
```
file: ./invoices/lithium_supplier_inv_2026.pdf
mode: tables
ocr: false
output_format: csv
```

**Output:**
```
Extraction complete.
Pages processed: 3
Tables found: 2
Rows extracted: 47
Output: ./output/lithium_supplier_inv_2026_tables.csv
Confidence: 99.2% (digital PDF)
```
