import { pipeline } from "@xenova/transformers";
import { HierarchicalNSW } from "hnswlib-node";

let embedder;
let index;
let documents = [];

const DIMENSION = 384; // MiniLM size

export async function initRAG() {
    if (!embedder) {
        embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    }

    if (!index) {
        index = new HierarchicalNSW("cosine", DIMENSION);
        index.initIndex(1000);
    }
}

// 🔹 Create embedding
export async function embed(text) {
    const output = await embedder(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
}

// 🔹 Add document
export async function addDocument(text) {
    await initRAG();

    const vector = await embed(text);
    const id = documents.length;

    index.addPoint(vector, id);
    documents.push(text);
}

// 🔹 Search
export async function search(query, k = 3) {
    await initRAG();

    const queryVector = await embed(query);
    const result = index.searchKnn(queryVector, k);

    return result.neighbors.map(i => documents[i]);
}