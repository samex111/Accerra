
// function findUnique(arr){
//   let underscore = 0;
//   let newArr = [];
//   let i=0;
//    if(arr.length===0){
//       return newArr
//     }
//   console.log(arr.length )
//   while(i<arr.length){
   
//     if((i+1) == arr.length){
//       newArr.push(arr[i])
//       break;
//     }
//     if(arr[i]==arr[i+1]){
//       underscore++
//     }else if(arr[i]<arr[i+1]){
//       newArr.push(arr[i])
//     }   
//    i++;
//   }

//   for(let i=0; i<underscore; i++){
//     newArr.push('_')
//   }
//   return newArr
// }                           

// console.log(findUnique([1,1,2]))
// console.log(findUnique([]))
                           
//  const arr = [1,3,5,6];

// function searchInsertPosition(arr,target){
//   const index =  arr.indexOf(target)
//   if(index != -1){
//     return index
//   }
//   for(let i=0; i<arr.length; i++){
//     if(arr[i]<target){
//       console.log("aage bado")
//     }else if(arr[i]>target){
//       return i
//     }
    
//   }
//       return arr.length 

// }

//  console.log(searchInsertPosition(arr,7));

// ek esa subarry jo sabse lamba ho and usme array reapet naa ho 
function LongestSubarray(arr){
    for(let i=0; i<arr.length; i++){
        for(let j=i; j<arr.length; j++){
          
        }
    }
}
arr = [1,2,3,4,5]
/* 
i=0 ---> 
1,2,3,4,5
i=1 --> 
2,3,4,5
i=2 -->
3,4,5
i=3 -->
4,5
i=4-->
5

*/