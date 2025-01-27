import { z } from "zod";

const operationSchema = z.enum(["add", "subtract", "multiply"]);
export const operations = operationSchema.options;

export const operationMap: Record<Operation, string> = {
	add: "+",
	subtract: "-",
	multiply: "*",
};

export const dataSchema = z.object({
	numbers: z.array(z.number()),
	answer: z.number(),
	operations: z.array(operationSchema),
	intermediateResults: z.array(z.number()),
});

export type Data = z.infer<typeof dataSchema>;
export type Operation = Data["operations"][number];

export type RunFile = {
	makePrompt: (data: Data) => string;
};

export const extractionSchema = z.object({
	finalAnswer: z
		.number()
		.describe("Analyze the text and extract the final answer."),
});
