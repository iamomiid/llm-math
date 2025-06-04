import { generateFormula, type MathResult } from "./gen";

export const generateDataset = (
	count: number,
	maxOperations: number,
	maxNumber: number
) => {
	const dataset: MathResult[] = [];

	for (let i = 0; i < count; i++) {
		const operations = Math.floor(Math.random() * maxOperations) + 1;
		const formula = generateFormula(operations, maxNumber);
		dataset.push(formula);
	}

	return dataset;
};
