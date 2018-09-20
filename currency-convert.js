// USD, CAD, 20
// 20 UDS is worth 24 in CAD. You can spend these in the following countries: Canada.
const axios = require('axios');

// http://data.fixer.io/api/latest?access_key=a6ac9dd5adf7837f567d6224bee40136

const getExchangeRate = async (from, to) => {
    try {
        const response = await axios.get('http://data.fixer.io/api/latest?access_key=a6ac9dd5adf7837f567d6224bee40136');
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];

        if (isNaN(rate)) {
            throw new Error();
        }

        return rate;
    } catch (e) {
        throw new Error(`Unable to get exchange rate for ${from} and ${to}.`);
    }
};

const getCountries = async (currencyCode) => {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map((country) => country.name);    
    } catch (e) {
        throw new Error(`Unable to get countries that use ${currencyCode}.`);
    }
}

const convertCurrency = async (from, to, amount) => {
    const rate = await getExchangeRate(from, to);
    const countries = await getCountries(to);
    return `${amount} ${from} is worth ${(amount * rate).toFixed(2)} ${to}. You can spend these in the following countries: ${countries.join(', ')}`;
}

convertCurrency('USD', 'CAD', 100).then((message) => {
    console.log(message);
}).catch((e) => {
    console.log(e.message);
});
