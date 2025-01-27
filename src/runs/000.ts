import { operationMap, type Data } from "@/types";

export const makePrompt = (data: Data) => {
	const formula = data.numbers.reduce((acc, num, i) => {
		if (i === 0) return num.toString();
		return `(${acc} ${operationMap[data.operations[i - 1]]} ${num})`;
	}, "");

	return `You are a math expert. You are given a formula and you need to find the result of the formula.
You need to think step by step and explain your reasoning.
What is the result of this formula?
${formula}
	`;
};
