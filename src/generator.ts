import { writeFileSync } from "fs";
import { operations, type Data, type Operation } from "./types";
import { doOperation } from "./utils";

const generateRandomNumber = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateRandomOperation = (): Operation => {
	const randomIndex = Math.floor(Math.random() * operations.length);
	return operations[randomIndex];
};

const generateDataSet = (count: number): Data[] => {
	const dataset: Data[] = [];

	for (let i = 0; i < count; i++) {
		// Generate between 3-8 numbers
		const numbersCount = generateRandomNumber(3, 8);
		const numbers: number[] = [];

		// Generate random numbers between 1 and 100
		for (let j = 0; j < numbersCount; j++) {
			numbers.push(generateRandomNumber(1, 100));
		}

		// Generate operations (one less than numbers)
		const operationsList: Operation[] = [];
		for (let j = 0; j < numbersCount - 1; j++) {
			operationsList.push(generateRandomOperation());
		}

		// Calculate the answer
		let currentResult = numbers[0];
		for (let j = 1; j < numbers.length; j++) {
			const operation = operationsList[j - 1];
			currentResult = doOperation(operation, [currentResult, numbers[j]]);
		}

		dataset.push({
			numbers,
			operations: operationsList,
			answer: currentResult,
		});
	}

	return dataset;
};

// Generate 1000 samples and save to file
const dataset = generateDataSet(1000);
writeFileSync("dataset.json", JSON.stringify(dataset, null, 2));
