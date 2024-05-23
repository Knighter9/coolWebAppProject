window.addEventListener("load",(event)=>{
    console.log('This js file is now running in the browser');

    const inputField = document.querySelector("#postContent");
    const submitButton = document.querySelector("#submitPost");

    submitButton.addEventListener('click', async (event)=>{
        event.preventDefault();
        console.log("The form has not submmited yet");
        console.log(inputField.value);
        const jsonData = {"content": inputField.value};
        let url = window.location.href;
        url = url.split('createPost')[0];
        url = url + 'api/createPost';
        let request = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData),
        })
        console.log(request.status);
        if(request.status == 200){
            inputField.value = "";
        }
    })


})