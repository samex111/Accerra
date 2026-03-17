import { get } from "mongoose";

export async function getQuote(){
    try{
        const res = await fetch('https://api.api-ninjas.com/v2/randomquotes?categories=education,inspirational',{
            method:'GET',
            headers:{
               'X-Api-Key': 'qIukODr0lBQxgPtpNvNuJg==hHjDp7RQ1p4k3sLW',
                'Content-Type':"application/json"
            }
        })
        const data = await res.json();

        return data 
    }
    catch(e){
        console.log("Error in catch: ",e)
    }
}
 
async function getQuoteFromDB(){
      const ans = await getQuote();
      console.log("Quote from API: ", ans);
      return ans;

}
const  quote =  getQuoteFromDB();
console.log("Quote from DB: ", quote);

