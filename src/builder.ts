import { writeFile } from "fs/promises";
import { generateDataset } from "./dataset";
import path from "path";

const run = async () => {
	const count = 100;
	const maxOperations = 10;
	const maxNumber = 100;

	const dataset = generateDataset(count, maxOperations, maxNumber);

	await writeFile(
		path.join(__dirname, "datasets", `dataset-${Date.now()}.json`),
		JSON.stringify(dataset, null, 2),
		"utf-8"
	);
};

run();
