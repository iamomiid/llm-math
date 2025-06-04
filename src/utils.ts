import { generateObject, generateText, LanguageModelV1 } from "ai";
import { z } from "zod";

export const thinkAndExtract = async <T extends z.ZodTypeAny>(
	model: LanguageModelV1,
	prompt: string,
	schema: T
) => {
	const { text } = await generateText({
		model,
		prompt,
	});

	const { object } = await generateObject<z.infer<T>>({
		model,
		messages: [
			{
				role: "system",
				content: "Analyze the text and extract the given schema.",
			},
			{ role: "user", content: text },
		],
		schema,
	});

	return {
		object,
		thinking: text,
	};
};
