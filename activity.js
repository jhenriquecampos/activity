const fs = require('fs');
const Sales = require('./base/sales.entity');
const Cashback = require('./base/cashback.entity')

const salesPath = __dirname + '/data/sales.csv';
const cashbackPath = __dirname + '/data/cashback.csv';

sales = getSalesFromFile();
cashbacks = getCashbacksFromFile();

sales.forEach(sale => {
    let respectiveCashback;
    cashbacks.forEach(cashback => {
        if (isRespectiveCashback(sale.createdAt, cashback.createdAt)) {
            respectiveCashback = cashback;
            return;
        }
    });
    printResultInConsole(sale, respectiveCashback);
});

function getSalesFromFile() {
    let sales = [];
    const fileContent = fs.readFileSync(salesPath);
    fileContent.toString().split('\n').forEach(row => {
        const splittedRowContent = row.split(',');
        let sale = new Sales(splittedRowContent[0], splittedRowContent[1],
            splittedRowContent[2], splittedRowContent[3]);
        if (isNumber(sale.id)) {
            sales.push(sale);
        }
    });
    return sales;
}

function getCashbacksFromFile() {
    let cashbacks = [];
    const fileContent = fs.readFileSync(cashbackPath);
    fileContent.toString().split('\n').forEach(row => {
        const splittedRowContent = row.split(',');
        let cashback = new Cashback(splittedRowContent[0], splittedRowContent[1],
            splittedRowContent[2], splittedRowContent[3]);
        if (isNumber(cashback.id)) {
            cashbacks.push(cashback);
        }
    });
    return cashbacks;
}

function isNumber(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function isRespectiveCashback(saleDate, cashbackDate) {
    const saleInDate = new Date(saleDate);
    const cashbackInDate = new Date(cashbackDate);
    return (Math.abs(saleInDate - cashbackInDate) / 1000) <= 5;
}

function printResultInConsole(sale, cashback) {
    const saleStr = `SALE#${sale.id} ${formatAmountInReais(sale.getAmountInReais())}; Date: ${sale.createdAt}`;
    const cashbackStr = cashback != undefined
        ? `CASHBACK#${cashback.id} ${formatAmountInBitcoins(cashback.getAmountInBitcoins())}; Date: ${cashback.createdAt}; BTC Price: ${getBitcoinPriceInReais(sale.getAmountInReais(), cashback.getAmountInBitcoins())}`
        : 'null';
    console.log(saleStr + ' => ' + cashbackStr);
}

function formatAmountInReais(amount) {
    return `R$${amount.toLocaleString('pt-BR', {minimumFractionDigits: 2})}`
}

function formatAmountInBitcoins(amount) {
    return `${amount.toLocaleString('pt-BR', {minimumFractionDigits: 8})} BTC`
}

function getBitcoinPriceInReais(reaisAmount, btcAmount) {
    const cashbackValue = reaisAmount * 0.5;
    return `R$${(cashbackValue/btcAmount).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
}