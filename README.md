# investec-swipe-n-save

# Investec Programmable Banking challenge - Card Code Snippet Creation

This is my additional submission for [https://investec.gitbook.io/programmable-banking-community-wiki/get-building/build-events/q2-2024-bounty-challenge-or-card-code-snippets](https://investec.gitbook.io/programmable-banking-community-wiki/get-building/build-events/q2-2024-bounty-challenge-or-card-code-snippets)


> At the end of the month, when your credit card balance becomes due, 100%* of it will be covered! No finance costs!! Amazing! Why has no one thought of this before??
> 
> \* configurable between 1 - 10000% !
> 
> Where does all of this FREE MONEY come from?  
> <sub>(you!)</sub>

The trick is to put aside money into a savings account each time you swipe your credit card. Let's automate that with Investec's Programmable Banking. 

Investec [Programmable Card API](https://developer.investec.com/za/api-products/documentation/SA_Card_Code) allows you to write custom code that executes whenever a card transaction occurs (including ATM withdrawals).

Investec [Private Banking API](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information) provides secure programmatic access to your bank accounts, from getting the account balances and other details to actually making payments to previous beneficiaries. 

We can combine these to make a transfer to a savings account whenever a card payment is made.

### Prerequisites

* Access to the Programmable Banking Card IDE - see [Investec  Developer Community wiki](https://investec.gitbook.io/programmable-banking-community-wiki/get-started/card-quick-start-guide) for a Quick Start Guide.

* An API Key with these permissions/scopes as a minimum: `account, transfer` - see  [Investec  Developer Community wiki](https://investec.gitbook.io/programmable-banking-community-wiki/get-started/api-quick-start-guide) for a Quick Start Guide.

![Required API Key scopes](./images/apikey-permissions.png?raw=true)

### Solution

Hopefully the [card code](https://github.com/petersmythe/investec-swipe-n-save/blob/main/main.js) is fairly obvious, but it first [fetches an OAuth token](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#section/Authentication) and then uses this token in a subsequent call to [perform the inter-account transfer](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#operation/transferv2).  

The amount saved is calculated as a percentage of the amount swiped, using the `percentage` configuration in `env.json`.  Also note that ATM withdrawals (merchant code: 6011) are excluded, so that only true card purchases result in a transfer to the savings account.

The account IDs need to be obtained manually via [getAccounts()](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#operation/accounts) or see the future enhancement below.

Also, please note that these [clientID, secret and API Key](https://github.com/petersmythe/investec-swipe-n-save/blob/main/env.json) all come from the Sandbox credentials ([see Oauth2-Sandbox](https://developer.investec.com/za/api-products/documentation/SA_PB_Account_Information#section/Authentication)) and only work on https://openapisandbox.investec.com, not the production URL: https://openapi.investec.com

### Future enhancement

*Self-fixing code!*

If the `toAccountId` and `fromAccountId` parameters are not found in the `env.json` file, the card code can make a once off API call (see `getAccounts()`) to obtain this data, and then use the [Card API to replace](https://developer.investec.com/za/api-products/documentation/SA_Card_Code#operation/UpdateFunctionEnvironmentVariables) its own `env.json` so that the next time it is called, the parameters are already available.

Note the API Key scope will need to include `card`.
