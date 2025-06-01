import { generateFormula, type MathResult } from "./gen";

const MAX_OPERATIONS = 10;

export const generateDataset = (count: number) => {
	const dataset: MathResult[] = [];

	for (let i = 0; i < count; i++) {
		const operations = Math.floor(Math.random() * MAX_OPERATIONS) + 1;
		const formula = generateFormula(operations);
		dataset.push(formula);
	}

	return dataset;
};
