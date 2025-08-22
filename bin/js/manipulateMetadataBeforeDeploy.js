/* -------------------------------------------------------------------------- */
/*                               Default Methods                              */
/*             Default methods to query data from the org created             */
/* -------------------------------------------------------------------------- */

const TARGET_ORG = process.argv[2];
const core = require('@salesforce/core');

async function getConnection() {
	try {
		return (
			await core.Org.create({
				aliasOrUsername: TARGET_ORG
			})
		).getConnection();
	} catch (error) {
		throw new Error('\nFAILED TO CONNECT TO ORG:\n\n' + error);
	}
}

async function queryRecord(query) {
	const conn = await getConnection();
	const records = (await conn.query(query)).records;
	if (records.length === 0) throw new Error('No records found.');
	return records[0];
}

/* -------------------------------------------------------------------------- */
/*                               Custom Methods                               */
/*               Custom methods to perform the operation needed               */
/* -------------------------------------------------------------------------- */

async function run() {
	const USER_ID = (await queryRecord(`SELECT Id FROM Group WHERE DeveloperName = 'MyQueue'`)).Id;

	// do somehting with ID to metadata before deploy
}

run();
