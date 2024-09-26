const debounce = (fn: Function, delay = 500) => {
	let timeout: NodeJS.Timeout;

	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			fn(...args);
		}, delay);
	};
};

export default debounce;