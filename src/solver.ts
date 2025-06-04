import "dotenv/config";
import { openai } from "@ai-sdk/openai";
import type { MathResult } from "./gen";
import { type LanguageModelV1 } from "ai";
import { z } from "zod";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { thinkAndExtract } from "./utils";

const improveSystemPrompt = async (
	model: LanguageModelV1,
	systemPrompt: string,
	result: MathResult,
	steps: string
) => {
	const prompt = `You are going to improve the system prompt for solving math formulas.
You are given a system prompt that was used to solve a formula using an LLM and the result of that formula.
The LLM failed to solve this formula. Understand why it failed and improve the system prompt to make it more accurate.
Do not include this formula in the improved system prompt.

Initial System Prompt:
"""
${systemPrompt}
"""

Formula:
"""
${result.formula}
"""

Correct steps to solve the formula:
"""
${result.steps}
"""

Correct Result:
"""
${result.result}
"""

LLM Model thinking:
"""
${steps}
"""
	`;

	const { object, thinking } = await thinkAndExtract(
		model,
		prompt,
		z.object({
			improvedSystemPrompt: z.string().describe("The improved system prompt."),
		})
	);

	return object.improvedSystemPrompt;
};

export const solveResult = async (
	model: LanguageModelV1,
	systemPrompt: string,
	result: MathResult
) => {
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

interface SolveResult {
	correct: boolean;
	steps: string;
}

interface ResultItem {
	input: MathResult;
	output: SolveResult;
	improvedSystemPrompt: string;
	improvedOutput: SolveResult;
}

interface Result {
	spec: {
		datasetId: string;
		modelId: string;
	};
	results: Array<ResultItem>;
}

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
	const result: Result = {
		spec: {
			datasetId,
			modelId,
		},
		results: [],
	};

	const systemPrompt = `You are a math expert. You are given a formula and you need to find the result of the formula.
What is the result of this formula?
`;

	let improvedSystemPrompt = systemPrompt;

	let i = 0,
		solved = 0,
		improved = 0;

	for (const input of datasetArray) {
		const isSolved = await solveResult(model, systemPrompt, input);
		const isImprovedSolved = await solveResult(
			model,
			improvedSystemPrompt,
			input
		);

		const item: ResultItem = {
			input,
			output: isSolved,
			improvedSystemPrompt,
			improvedOutput: isImprovedSolved,
		};

		if (isImprovedSolved.correct) {
			improved++;
		} else {
			console.log(
				"Failed to solve formula by improved system prompt",
				input.formula
			);
			improvedSystemPrompt = await improveSystemPrompt(
				model,
				systemPrompt,
				input,
				isSolved.steps
			);
		}

		if (isSolved.correct) {
			solved++;
		}

		if (!isSolved.correct && isImprovedSolved.correct) {
			console.log("It worked! Improved system prompt:", improvedSystemPrompt);
		}

		result.results.push(item);
		await writeFile(resultsPath, JSON.stringify(result, null, 2));
		i++;

		console.log("System Accuracy", (solved / i) * 100, "%");
		console.log("Improved System Accuracy", (improved / i) * 100, "%");
		console.log("--------------------------------");
	}
};

solveDataset();
