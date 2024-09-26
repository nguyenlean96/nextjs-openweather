// hour:minute:second?
// Example: 12:59:59
function getTime(time: any, get_seconds: boolean = false): string {
	const date = new Date(time * 1000);
	const hours = date.getHours();
	const minutes = '0' + date.getMinutes();
	const seconds = '0' + date.getSeconds();
	return (
		(hours > 12 ? hours - 12 : hours) +
		':' +
		minutes.slice(minutes.length - 2, minutes.length) +
		(get_seconds ? ':' + seconds.slice(seconds.length - 2, seconds.length) : '')
	);
}

function secondConverterToTimerFormat(seconds: number): {
	year?: number;
	month?: number;
	week?: number;
	day?: number;
	hours: number;
	minutes: number;
	seconds: number;
} {
	const year = Math.floor(seconds / 31536000);
	const month = Math.floor((seconds - year * 31536000) / 2592000);
	const week = Math.floor((seconds - year * 31536000 - month * 2592000) / 604800);
	const day = Math.floor(
		(seconds - year * 31536000 - month * 2592000 - week * 604800) / 86400
	);
	const hours = Math.floor(
		(seconds - year * 31536000 - month * 2592000 - week * 604800 - day * 86400) / 3600
	);
	const minutes = Math.floor(
		(seconds -
			year * 31536000 -
			month * 2592000 -
			week * 604800 -
			day * 86400 -
			hours * 3600) /
			60
	);
	const seconds_left = Math.floor(
		seconds -
			year * 31536000 -
			month * 2592000 -
			week * 604800 -
			day * 86400 -
			hours * 3600 -
			minutes * 60
	);
	return {
		year: year,
		month: month,
		week: week,
		day: day,
		hours: hours,
		minutes: minutes,
		seconds: seconds_left,
	};
}

export { getTime, secondConverterToTimerFormat };
