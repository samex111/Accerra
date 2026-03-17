
export async function Anlyzer(prompt:string , GEMINI_API_KEY:string){
    try{
          const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+GEMINI_API_KEY ,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                }),
            }
        );

        const data = await response.json();
        // console.log(data)
        console.log(data.candidates[0].content.parts[0].text)
        return data.candidates[0].content.parts[0].text
    }catch(e){
        return e
    }
}

// Anlyzer('is this question need vextor search in jee neet stident db ans in yes or No , no extra explaination:-- What is 7 * 7' );
 