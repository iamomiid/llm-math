const MAX_NUMBER = 50;

type Operation = "+" | "-" | "*";

interface MathResult {
	formula: string;
	steps: string[];
	result: number;
}

const getRandomNumber = (): number =>
	Math.floor(Math.random() * MAX_NUMBER) + 1;

const getRandomOperation = (): Operation => {
	const operations: Operation[] = ["+", "-", "*"];
	return operations[Math.floor(Math.random() * operations.length)];
};

const calculateOperation = (
	a: number,
	b: number,
	operation: Operation
): number => {
	switch (operation) {
		case "+":
			return a + b;
		case "-":
			return a - b;
		case "*":
			return a * b;
	}
};

interface Expression {
	left: number | Expression;
	right: number | Expression;
	operation: Operation;
}

const generateExpression = (
	remainingOperations: number
): Expression | number => {
	if (remainingOperations === 0) {
		return getRandomNumber();
	}

	const operation = getRandomOperation();
	const leftOperations = Math.floor(Math.random() * remainingOperations);
	const rightOperations = remainingOperations - leftOperations - 1;

	const left = generateExpression(leftOperations);
	const right = generateExpression(rightOperations);

	return { left, right, operation };
};

const evaluateExpression = (
	expr: Expression | number
): { value: number; steps: string[] } => {
	if (typeof expr === "number") {
		return { value: expr, steps: [] };
	}

	const leftResult = evaluateExpression(expr.left);
	const rightResult = evaluateExpression(expr.right);
	const result = calculateOperation(
		leftResult.value,
		rightResult.value,
		expr.operation
	);

	const step = `${leftResult.value} ${expr.operation} ${rightResult.value} = ${result}`;
	return {
		value: result,
		steps: [...leftResult.steps, ...rightResult.steps, step],
	};
};

const expressionToString = (expr: Expression | number): string => {
	if (typeof expr === "number") {
		return expr.toString();
	}
	return `(${expressionToString(expr.left)} ${
		expr.operation
	} ${expressionToString(expr.right)})`;
};

const generateFormula = (n: number): MathResult => {
	const expression = generateExpression(n);
	const { value, steps } = evaluateExpression(expression);

	return {
		formula: expressionToString(expression),
		steps,
		result: value,
	};
};

export { generateFormula, type MathResult };
