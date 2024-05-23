

window.addEventListener("load",(event)=>{
    const likeButtons = document.getElementsByClassName("likeButton");

    async function likePost(url,message){
        const result = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        })
        console.log(result);
        console.log(result.status);
        return result.status;
    }

    for(let button of likeButtons){
        button.addEventListener("click",async()=>{
            let post_id = button.id;
            console.log(post_id);
            // get the parentElement
            let parentElement = button.parentElement;
            // get the span element which contains the current number likes
            let span = parentElement.querySelector("span");

            let count = Number(span.innerText);
            // get the url
            // now create a fetch post request to update the like count
            let url = window.location.href;

            url = url.split('?')[0];

            url = url + "api/likePosts";

            let jsonData = {
                id: post_id,
            }

            let result = await likePost(url,jsonData);
            console.log(result);

            if(result == 200){
                span.innerText = count + 1;
            }

        })
        
    }
})