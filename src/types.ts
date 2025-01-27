export type Operation = "subtract" | "add" | "multiply" | "divide";
export const operations: Operation[] = ["add", "subtract", "multiply"];

export type Data = {
	numbers: number[];
	answer: number;
	operations: Operation[];
};
