// const url="http://api.weatherapi.com/v1/current.json?key=82b0f7ab6b144d9695270851241212&q=27.7172,85.3240";

// (async()=>{
// const response=await fetch(url);
// const data=await response.json();
// console.log(data.current.feelslike_c);
// })();

(async()=>{const response=await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: "sameer",
      body: "beta",
      userId: 1
    }),
  })

const data=await response.json();
console.log(data);
})();

  

