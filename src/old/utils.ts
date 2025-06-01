import type { Operation } from "./types";

export const doOperation = (operation: Operation, numbers: number[]) => {
	switch (operation) {
		case "add":
			return numbers.reduce((a, b) => a + b, 0);
		case "subtract":
			return numbers.reduce((a, b) => a - b);
		case "multiply":
			return numbers.reduce((a, b) => a * b, 1);
	}
};
