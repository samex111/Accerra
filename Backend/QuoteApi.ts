async function getQuote(){
    try{
        const res = await fetch('https://api.api-ninjas.com/v2/randomquotes?categories=education,inspirational',{
            method:'GET',
            headers:{
               'X-Api-Key': 'qIukODr0lBQxgPtpNvNuJg==hHjDp7RQ1p4k3sLW',
                'Content-Type':"application/json"
            }
        })
        const data = await res.json();

        const a = data.map((item:any)=>item.quote)
        console.log(data)
        console.log(a)
    }
    catch(e){
        console.log("Error in catch: ",e)
    }
}
getQuote();