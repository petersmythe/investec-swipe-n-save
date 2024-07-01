async function getAccessToken() {
    const response = await fetch(
        'https://openapisandbox.investec.com/identity/v2/oauth2/token', {
            method: 'POST',
            headers: {
                "Authorization": "Basic " + Buffer.from(process.env.clientId + ':' + process.env.secret).toString('base64'),
                "x-api-key": process.env.apikey,
                "content-type": "application/x-www-form-urlencoded"
            },
            body: 'grant_type=client_credentials'
        });
    // console.log(response.status);
    return (await response.json()).access_token;
};
async function getAccounts(token) {
    const response = await fetch(
        `https://openapisandbox.investec.com/za/pb/v1/accounts`, {
            method: 'GET',
            headers: {
                "Authorization": "Bearer " + token
            }
        });
    // console.log(response.status);
    return (await response.json());
};
async function doTransfer(token, amount) {
    const response = await fetch(
        `https://openapisandbox.investec.com/za/pb/v1/accounts/${process.env.fromAccountId}/transfermultiple`, {
            method: 'POST',
            headers: {
                "Authorization": "Bearer " + token,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                "transferList": [{
                    "beneficiaryAccountId": process.env.toAccountId,
                    "amount": investec.helpers.format.decimal(amount / 100, 100),
                    "myReference": "Swipe-n-Save",
                    "theirReference": "Swipe-n-Save"
                }],
                "profileId": process.env.profileId
            })
        });
    // console.log(response.status);
    return (await response.json());
};
// This function runs before a transaction.
const beforeTransaction = async (authorization) => {
  console.log(authorization);
  return true;
};
// This function runs after a transaction was successful.
const afterTransaction = async (transaction) => {
	if (transaction.merchant.category.code != 6011) {	// Don't do the transfer for ATM withdrawals
		const token = await getAccessToken();
		// const accounts = await getAccounts(token);
		// console.log(accounts);
		const transfer = await doTransfer(token, transaction.centsAmount * process.env.percentage / 100);
		console.log(transfer);
		// console.log(transaction);
	}
};
// This function runs after a transaction has been declined.
const afterDecline = async (transaction) => { 
  console.log(transaction);
};
// This function runs after a transaction has been reversed.
const afterReversal = async (transaction) => { 
  console.log(transaction);
};
// This function runs after a transaction has been adjusted.
const afterAdjustment = async (transaction) => { 
  console.log(transaction);
};