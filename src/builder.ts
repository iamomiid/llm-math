import { writeFile } from "fs/promises";
import { generateDataset } from "./dataset";
import path from "path";

const COUNT = 100;

const run = async () => {
	const dataset = generateDataset(COUNT);
	await writeFile(
		path.join(__dirname, "dataset.json"),
		JSON.stringify(dataset, null, 2),
		"utf-8"
	);
};

run();
