let input =
	'Lead Chef, Chipotle, Denver, CO, 10, 15\n' +
	'Stunt Double, Equity, Los Angeles, CA, 15, 25\n' +
	'Manager of Fun, IBM, Albany, NY, 30, 40\n' +
	'Associate Tattoo Artist, Tit 4 Tat, Brooklyn, NY, 250, 275\n' +
	'Assistant to the Regional Manager, IBM, Scranton, PA, 10, 15\n' +
	'Lead Guitarist, Philharmonic, Woodstock, NY, 100, 200';

let state = 'NY';
// let state = '';

/*
  Result should look like: 
  Title: Assistant to the Regional Manager, Organization: IBM, Location: Scranton, PA, Pay: 10-15
  Title: Associate Tattoo Artist, Organization: Tit 4 Tat, Location: Brooklyn, NY, Pay: 250-275
  Title: Lead Chef, Organization: Chipotle, Location: Denver, CO, Pay: 10-15
  Title: Lead Guitarist, Organization: Philharmonic, Location: Woodstock, NY, Pay: 100-200
  Title: Manager of Fun, Organization: IBM, Location: Albany, NY, Pay: 30-40
  Title: Stunt Double, Organization: Equity, Location: Los Angeles, CA, Pay: 15-25
  */

// ! Part 1

formatResult(input, state);

function formatResult(input, state = '') {
	const formatted = formatInput(input);
	const jobsObj = convertToObj(formatted);
	const filtered = filterByState(jobsObj, state);

	// Parts 1 & 2:
	if (!state) return convertBackToString(jobsObj);
	return convertBackToString(filtered);

	// Part 3:
	// return filterFast(jobsObj, state);
}

// takes input, formats into arr of arrs
function formatInput(input) {
	return input
		.split('\n')
		.map((element) => element.split(',').map((element) => element.trim()))
		.sort((a, b) => (a[0] > b[0] ? 1 : -1));
}

// converting arr of arrs to arr of objects with specified keys
function convertToObj(input) {
	return input.map(([title, org, city, state, minPay, maxPay]) => ({
		Title: title,
		Organization: org,
		Location: `${city}, ${state}`,
		Pay: `${minPay}-${maxPay}`,
	}));
}

// we want to create obj from array -> use reduce
// we want to create an arr of objs -> use map

// converting arr of objs to final string format
function convertBackToString(input) {
	let result = '';
	// make empty string to hold result
	for (let job of input) {
		// loop through each job in input
		// The for...of statement creates a loop iterating over iterable objects
		result += Object.entries(job)
			// add each entry to result
			.map((element) => element.join(': '))
			// join each sub-array by ': ' and then join that result by ', '
			.join(', ');
		// The join() method creates and returns a new string by concatenating all of the elements in an array (or an array-like object), separated by commas or a specified separator string
		result += '\n';
		// add a line break after each iteration
	}
	return result;
}

// ! Part 2
// add method to filter list by state, use NY for this example
// declare new array to hold result
// iterate through array of objects

function filterByState(input, state) {
	const result = [];

	// console.log(state);
	input.forEach((element) => {
		if (element.Location.split(', ')[1] === state) {
			result.push(element);
		}
	});

	return result;
}

// ! Part 3
// get state lookup to be O(1)
// we can use a hashmap
// Searching by keys in a hash is an O(1) lookup

function filterFast(input, state) {
	const hashmap = {};
	const result = [];
	// populate hashmap
	input.forEach((element) => {
		if (element.Location.split(', ')[1] === state) {
			hashmap[element.Title] = true;
		}
	});
	// search hashmap
	input.forEach((element) => {
		if (hashmap[element.Title]) {
			result.push(element);
		}
	});
	return result;
}

// ! Part 4
// extend library to handle a json input
// needs to be able to handle nested JSON objects

let jsonInput =
	'Stunt Double, Equity, Los Angeles, CA, 15, 25\n' +
	'Manager of Fun, IBM, Albany, NY, 30, 40\n' +
	'Associate Tattoo Artist, Tit 4 Tat, Brooklyn, NY, 250, 275\n' +
	'Assistant to the Regional Manager, IBM, Scranton, PA, 10, 15\n' +
	'Lead Guitarist, Philharmonic, Woodstock, NY, 100, 200\n' +
	'--JSON-INPUT-BELOW--\n' +
	'{"name": "Dog Walker", "organization": "Wag", "city": "Flushing", "state": "NY", "pay": {"min":10, "max":15}}\n' +
	'{"name": "Cat Walker", "organization": "Rover", "city": "Forest Hills", "state": "NY", "pay": {"min":10, "max":15}}';

const combinedJobs = formatWithJson(jsonInput);
const sortedJobs = sortList(combinedJobs);
const jobObj = convertToObj(sortedJobs);
const finalJobs = convertBackToString(jobObj);
// console.log(finalJobs);

function formatWithJson(input) {
	const splitInput = input.split('\n--JSON-INPUT-BELOW--\n');
	const stringJobs = formatInput(splitInput[0]);
	const jsonJobs = splitInput[1].split('\n').map((job) => JSON.parse(job));

	const jsonResult = [];
	jsonJobs.map((job) => {
		jsonResult.push([
			job.name,
			job.organization,
			job.city,
			job.state,
			job.pay.min.toString(),
			job.pay.max.toString(),
		]);
	});

	return stringJobs.concat(jsonResult);
}
