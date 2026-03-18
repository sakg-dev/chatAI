// const a = []
// console.log(a.join(" "))

// (async () => {
//     const req = await fetch("https://ai.hackclub.com/proxy/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Authorization": "Bearer YOUR_API_KEY",
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//             "model": "qwen/qwen3-32b",
//             "messages": [
//                 { "role": "user", "content": "Hello!" }
//             ]
//         })
//     })
//     const response = await req.json()
//     console.log(response.choices[0].message.content);
// })()