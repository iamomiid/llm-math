import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import type { MathResult } from "./gen";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const prompt = `
You are a math expert. You are given a formula and you need to find the result of the formula.
What is the result of this formula?
`;

const model = openai("gpt-4.1-mini");

export const solveResult = async (result: MathResult) => {
	const { text } = await generateText({
		model,
		messages: [
			{ role: "system", content: prompt },
			{ role: "user", content: result.formula },
		],
	});

	const { object } = await generateObject({
		model,
		messages: [
			{
				role: "system",
				content:
					"Analyze the text and extract the final answer. The answer should be a number.",
			},
			{ role: "user", content: text },
		],
		schema: z.object({
			result: z.number(),
		}),
	});

	return {
		correct: object.result === result.result,
		steps: text,
	};
};

export const solveDataset = async () => {
	const dataset = await readFile(path.join(__dirname, "dataset.json"), "utf-8");
	const datasetArray = JSON.parse(dataset) as MathResult[];
	const resultsPath = path.join(
		__dirname,
		`solving-results-${Date.now()}.json`
	);
	const results: Array<{
		input: MathResult;
		output: { correct: boolean; steps: string };
	}> = [];

	for (const result of datasetArray) {
		console.log("Solving formula", result.formula);
		const isSolved = await solveResult(result);
		console.log("Is solved", isSolved.correct);
		results.push({ input: result, output: isSolved });
		await writeFile(resultsPath, JSON.stringify(results, null, 2));
	}
};

solveDataset();
