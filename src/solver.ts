import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import type { MathResult } from "./gen";
import { type LanguageModelV1 } from "ai";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { thinkAndExtract } from "./utils";

export const solveResult = async (
	model: LanguageModelV1,
	result: MathResult
) => {
	const systemPrompt = `
You are a math expert. You are given a formula and you need to find the result of the formula.
What is the result of this formula?
`;
	const userPrompt = `
Formula: ${result.formula}
`;

	const prompt = `${systemPrompt}\n${userPrompt}`;

	const { object, thinking } = await thinkAndExtract(
		model,
		prompt,
		z.object({
			result: z
				.number()
				.describe("The result of the formula - it should be a number."),
		})
	);

	return {
		correct: object.result === result.result,
		steps: thinking,
	};
};

export const solveDataset = async () => {
	const datasetId = "dataset-1749030125809";
	const modelId = "gpt-4.1-nano";

	const model = openai(modelId);
	const dataset = await readFile(
		path.join(__dirname, "datasets", `${datasetId}.json`),
		"utf-8"
	);
	const datasetArray = JSON.parse(dataset) as MathResult[];
	const resultsPath = path.join(
		__dirname,
		"results",
		`solving-results-${Date.now()}.json`
	);
	const result: {
		spec: {
			datasetId: string;
			modelId: string;
		};
		results: Array<{
			input: MathResult;
			output: { correct: boolean; steps: string };
		}>;
	} = {
		spec: {
			datasetId,
			modelId,
		},
		results: [],
	};

	for (const input of datasetArray) {
		const isSolved = await solveResult(model, input);

		console.log("Solving formula", input.formula, isSolved.correct);
		result.results.push({ input, output: isSolved });

		await writeFile(resultsPath, JSON.stringify(result, null, 2));
	}
};

solveDataset();
