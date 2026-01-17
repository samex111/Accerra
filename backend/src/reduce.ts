const  price = [100,90,10,40,29];
const total = price.reduce(sumOfPrice);
function sumOfPrice(item:number,nextItem:number){
    return Math.max(item , nextItem)
}                           
console.log(`₹${total}`)
const arr = [1,2,3,4,10,5,6,7,12,-1];
function findMax(...arr:number[]){
    let max :number =0
    // for(let element of arr){
    //     if(element>max){
    //         max =element
    //     }
    // }
    for(let i=0; i<arr.length; i++){
        if(arr[i]>arr[0]){
            max=arr[i]
        }else(max=arr[0])
    }
return max
}
const ans  = findMax(...arr)
console.log(ans)