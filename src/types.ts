export type Operation = "subtract" | "add" | "multiply";
export const operations: Operation[] = ["add", "subtract", "multiply"];

export type Data = {
	numbers: number[];
	answer: number;
	operations: Operation[];
	intermediateResults: number[];
};
