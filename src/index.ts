import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import { dataSchema, extractionSchema, type RunFile } from "./types";
import { generateObject, generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const run = async () => {
	const runFile = (await import(
		path.join(__dirname, "./runs/000.ts")
	)) as RunFile;

	const dataset = await fs.readFile(
		path.join(__dirname, "./dataset.json"),
		"utf-8"
	);
	const datasetData = dataSchema.array().parse(JSON.parse(dataset));

	const testSet = datasetData.slice(0, 10);

	let correct = 0;
	let incorrect = 0;

	for (const data of testSet) {
		const prompt = runFile.makePrompt(data);

		const { text } = await generateText({
			model: openai("gpt-4o-mini"),
			prompt: prompt,
		});

		const { object } = await generateObject({
			model: openai("gpt-4o-mini"),
			prompt: text,
			schema: extractionSchema,
		});

		if (object.finalAnswer === data.answer) {
			correct++;
		} else {
			incorrect++;
		}

		console.log(object.finalAnswer, data.answer);
	}

	console.log(`Correct: ${correct}, Incorrect: ${incorrect}`);
};

run();
