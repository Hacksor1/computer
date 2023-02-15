export function formatPrice(price) {
    return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ').slice(0, -3)
}