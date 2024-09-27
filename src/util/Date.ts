// Get month as a string
function getMonth(time: any, numberType: boolean = false): string {
	const date = new Date(time * 1000);
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'June',
		'July',
		'Aug',
		'Sept',
		'Oct',
		'Nov',
		'Dec',
	];
	// prettier-ignore
	return numberType ? (((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1)) : months[date.getMonth()];
}

// Get day of week as a string
function getDayOfWeek(time: any, short: boolean = false): string {
	const date = new Date(time * 1000);
	const days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];
	const days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	return short ? days_short[date.getDay()] : days[date.getDay()];
}

// Get day ordinal in a year (1-365)
function getDayOfYear(time: any): number {
	const date: any = new Date(time * 1000);
	const start: any = new Date(date.getFullYear(), 0, 0);
	const diff: number = date - start;
	const oneDay = 1000 * 60 * 60 * 24;
	return Math.floor(diff / oneDay);
}

// Get day of month (1-31)
function getDate(time: any): number {
	const date = new Date(time * 1000);
	return date.getDate();
}

// Get day of month (01-31) as a string
function getDateString(time: any): string {
	const date = new Date(time * 1000);
	return (date.getDate() < 10 ? '0' : '') + date.getDate();
}

// Get year
function getYear(time: any): number {
	const date = new Date(time * 1000);
	return date.getFullYear();
}

export { getMonth, getDayOfWeek, getDayOfYear, getDate, getDateString, getYear };
