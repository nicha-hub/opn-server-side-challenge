class Cart {
    constructor () {
        this.items = {} // {product_id: {quantity: x, price: y}}
        this.discounts = null // {type: fixed, value: 15}
        this.freebies = {} // {product_id: {free_product_id: 2, quantity: 1, price: 0}}
    }

    createCart () {
        this.items = {}
        this.discounts = null
        this.freebies = {}
        console.log(`=> Cart has been created`)
    }

    addProduct (product_id, quantity, price, isFreebie = false) {
        if (this.items[product_id]) {
            this.items[product_id].quantity += quantity
            if (!isFreebie) {
                this.items[product_id].price = price
            }
        }else {
            this.items[product_id] = {quantity, price}
        }
        if (isFreebie) {
            if (!this.items[product_id].freebies) {
                this.items[product_id].freebies = {quantity: 0}
            }
            this.items[product_id].freebies.quantity += quantity;
        }
        console.log(`=> Add (${quantity}) product ${product_id}${isFreebie? ' (freebies)' : ''} to cart`)
    }

    updateProduct (product_id, quantity) {
        if (this.items[product_id]) {
            this.items[product_id].quantity = quantity
            console.log(`=> Update product ${product_id} with quantity ${quantity}`)
        }else{
            console.log(`=> Unable to update product ${product_id}: not found`)
        }
    }

    removeProduct (product_id) {
        if (this.items[product_id]) {
            delete this.items[product_id]
            console.log(`=> Delete product ${product_id} out of cart`)
        }else{
            console.log(`=> Unable to delete product ${product_id}: not found`)
        }
    }

    destroyCart () {
        this.items = {}
        this.discounts = null
        this.freebies = {}
        console.log(`Cart has been destroyed`)
    }

    checkProductExist (product_id) {
        if(this.items[product_id]){
            return true
        }else{
            return false
        }
    }

    isEmpty () {
        return Object.keys(this.items).length === 0
    }

    getProductList () {
        return Object.entries(this.items).map((item)=>{
            const [product_id, product_data] = item
            return {product_id: product_id, ...product_data}
        })
    }

    countUniqueProduct () {
        return Object.keys(this.items).length
    }

    totalAmountProduct () {
        return Object.keys(this.items).reduce((total, product_id)=>total + this.items[product_id].quantity, 0)
    }

    applyCoupon (name, type, value, max = null) {
        this.discounts = {name, type, value, max}
        if (type === 'fixed' || (type === 'percentage')) {
            let show_txt = type === 'fixed'? `${value} off` : `${value}% off${max !== null? `, not exceeding ${max}` : ''}`;
            console.log(`=> Coupon "${name}" (${show_txt}): applied`)
        }else {
            this.discounts = null;
            console.log(`=> Unable to apply coupon "${name}"`)
        }
    }

    removeCoupon (name) {
        if (this.discounts && this.discounts.name === name) {
            this.discounts = null
            console.log(`=> Coupon "${name}" is removed`)
        }else{
            console.log(`=> Unable to remove coupon "${name}": not found`)
        }
    }

    calculateTotalAmount () {
        let total = Object.values(this.items).reduce((total, item)=>{
            let real_quantity = item.quantity - (item.freebies? item.freebies.quantity : 0)
            return total + real_quantity * item.price
        }, 0)
        let discount = 0
        if (this.discounts) {
            const {type, value, max} = this.discounts
            if (type === 'fixed') {
                discount = Math.min(total, value)
            }else if (type === 'percentage') {
                discount = value / 100 * total
                discount = Math.min(discount, max)
            }
        }
        total -= discount;
        return total;
    }

    addFreebie (product_id, free_product_id, quantity = 1) {
        this.freebies[product_id] = {free_product_id, quantity}
        console.log(`=> Freebie applied: "Buy product ${product_id}, get (${quantity}) product ${free_product_id} for free!"`)
    }

    checkAndAppleFreebie () {
        Object.keys(this.items).map((product_id)=>{
            if (this.freebies[product_id]) {
                const {free_product_id, quantity, price} = this.freebies[product_id]
                this.addProduct(free_product_id, quantity, 0, true)
            }
        })
    }

}

module.exports = Cart;