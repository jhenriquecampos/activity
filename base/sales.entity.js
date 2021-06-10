module.exports = class Sales {

    constructor(id, amount, createdAt, ref) {
        this.id = id;
        this.amount = amount;
        this.createdAt = createdAt;
        this.ref = ref;
    }

    getAmountInReais() {
        return this.amount / 100.0;
    }

};