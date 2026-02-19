---
name: vector-embedder
description: Generates and stores vector embeddings for semantic search pipelines. Use when building RAG systems, semantic search, or AI-powered recommendation engines.
---

# Vector Embedding Agent

## When to use
Use this skill to generate vector embeddings from text, code, or documents and store them in a vector database for semantic retrieval.

## Instructions
1. Accept a list of documents, records, or text chunks to embed
2. Chunk long documents into appropriate sizes (512-1024 tokens)
3. Call the embedding model API (OpenAI, Gemini, or local)
4. Store embeddings with metadata in the vector store (pgvector, Pinecone, or Supabase)
5. Create or update the vector index for efficient similarity search
6. Return the embedding count and index statistics

## Environment
- Runtime: python-3.12
- Trigger: API
- Category: Data and AI Agents

## Examples
- "Embed all product descriptions in our Supabase catalog for semantic search"
- "Generate embeddings for our knowledge base articles and store in pgvector"
