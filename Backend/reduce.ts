const  price = [100,90,10,40,29];
const total = price.reduce(sumOfPrice);
function sumOfPrice(item:number,nextItem:number){
    return Math.max(item , nextItem)
}                           
console.log(`₹${total}`)