module.exports = class Cashback {

    constructor(id, amount, createdAt, ref) {
        this.id = id;
        this.amount = amount;
        this.createdAt = createdAt;
        this.ref = ref;
    }

    getAmountInBitcoins() {
        return this.amount / 100000000.0;
    }

};