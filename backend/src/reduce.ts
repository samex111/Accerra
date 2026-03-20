// ek array me remove karna hai duplicates and return the leangth of the array afteer removing the ducclicte elemnt 
 function removeDuplicates(array:number[]){
    let k = 0;
    for(let i=0; i<array.length; i++){
        if(array[i] !== array[i-1]){
            array[k] = array[i]
               k++;
        }
    }
    array.length = k
    console.log(array)
    return k

}
 const ans = removeDuplicates([0,0,1,1,1,2,2,3,3,4])
 console.log(ans)
 var removeElement = function(nums:number[], val:number) {
    let i = 0;
    let n = nums.length;

    while (i < n) {
        if (nums[i] === val) {
            nums[i] = nums[n - 1]; // swap with last
            n--;
        } else {
            i++;
        }
    }
console.log(nums)
    return n;
};
const ans1 = removeElement([3,2,2,3],3)
 console.log(ans1)